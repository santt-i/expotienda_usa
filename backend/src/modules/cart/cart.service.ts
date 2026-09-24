import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }
    return cart;
  }

  async getCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    const total = cart.items.reduce((sum, item) => {
      const price = item.price ?? Number(item.product.priceCOP);
      return sum + (price * item.quantity);
    }, 0);
    return { items: cart.items, total };
  }

  async addItem(userId: number, addToCartDto: AddToCartDto) {
  const { productId, quantity, customPrice } = addToCartDto;
  if (quantity <= 0) {
    // Si la cantidad es cero, eliminar el item si existe
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cart: { userId }, productId },
    });
    if (existingItem) {
      await this.prisma.cartItem.delete({ where: { id: existingItem.id } });
      // No retornamos nada, simplemente eliminamos
    }
    return { message: 'Item eliminado' };
  }

  const product = await this.prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new NotFoundException('Producto no encontrado');
  if (product.stock < quantity) throw new ForbiddenException('Stock insuficiente');

  const price = customPrice ?? Number(product.priceCOP);

  const cart = await this.getOrCreateCart(userId);
  const existingItem = await this.prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existingItem) {
    // Actualizar cantidad y precio (el precio de la cotización tiene prioridad)
    return this.prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity,
        price, // sobrescribe el precio con el de la cotización
      },
      include: { product: true },
    });
  } else {
    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        price,
      },
      include: { product: true },
    });
  }
}

  async updateItem(userId: number, itemId: number, quantity: number) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cart: { userId } },
      include: { product: true },
    });
    if (!item) throw new NotFoundException('Item no encontrado');
    if (quantity <= 0) {
      return this.prisma.cartItem.delete({ where: { id: itemId } });
    }
    if (item.product.stock < quantity) throw new ForbiddenException('Stock insuficiente');
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true },
    });
  }

  async removeItem(userId: number, itemId: number) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cart: { userId } },
    });
    if (!item) throw new NotFoundException('Item no encontrado');
    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }

  async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  async checkout(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    if (cart.items.length === 0) throw new ForbiddenException('Carrito vacío');

    for (const item of cart.items) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new NotFoundException(`Producto ${item.productId} no encontrado`);
      if (product.stock < item.quantity) {
        throw new ForbiddenException(`Stock insuficiente para ${product.name}`);
      }
    }

    return this.prisma.$transaction(async (prisma) => {
      const storeId = cart.items[0].product.storeId;
      let total = 0;
      const orderItems: { productId: number; quantity: number; price: number }[] = [];

      for (const item of cart.items) {
        const price = item.price ?? Number(item.product.priceCOP);
        total += price * item.quantity;
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price,
        });

        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const order = await prisma.order.create({
        data: {
          buyerId: userId,
          storeId,
          total,
          status: OrderStatus.PENDING,
          items: { create: orderItems },
        },
        include: { items: { include: { product: true } } },
      });

      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      return order;
    });
  }
}