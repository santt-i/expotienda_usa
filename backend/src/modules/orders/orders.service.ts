import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const { storeId, items } = createOrderDto;

    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException(`Tienda ${storeId} no existe`);

    return this.prisma.$transaction(async (prisma) => {
      let total = 0;
      const orderItems: { productId: number; quantity: number; price: number }[] = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new NotFoundException(`Producto ${item.productId} no existe`);

        const price = Number(product.priceCOP);
        if (product.stock < item.quantity) {
          throw new ForbiddenException(`Stock insuficiente para ${product.name}`);
        }

        total += price * item.quantity;
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: price,
        });

        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        });
      }

      return prisma.order.create({
        data: {
          buyerId: userId,
          storeId,
          total,
          status: OrderStatus.PENDING,
          items: { create: orderItems },
        },
        include: {
          items: { include: { product: true } },
          buyer: { select: { id: true, name: true, email: true } },
          store: true,
        },
      });
    });
  }

  async findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { buyerId: userId },
      include: { items: { include: { product: true } }, store: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number, userRole: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        buyer: { select: { id: true, name: true, email: true } },
        store: true,
      },
    });
    if (!order) throw new NotFoundException(`Orden ${id} no existe`);
    if (order.buyerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso');
    }
    return order;
  }

  async findStoreOrders(storeId: number, userId: number, userRole: string) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException(`Tienda ${storeId} no existe`);
    if (store.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso');
    }
    return this.prisma.order.findMany({
      where: { storeId },
      include: { items: { include: { product: true } }, buyer: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, updateOrderDto: UpdateOrderDto, userId: number, userRole: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { store: true },
    });
    if (!order) throw new NotFoundException(`Orden ${id} no existe`);
    // ✅ Permiso: solo el dueño de la tienda o ADMIN
    if (order.store.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso para actualizar esta orden');
    }
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: { items: { include: { product: true } } },
    });
  }

  async cancelOrder(id: number, userId: number, userRole: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new NotFoundException(`Orden ${id} no existe`);
    if (order.buyerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new ForbiddenException('Solo órdenes pendientes pueden cancelarse');
    }
    // Validación de 2 horas
    const now = new Date();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    if (now.getTime() - new Date(order.createdAt).getTime() > twoHoursInMs) {
      throw new ForbiddenException('El tiempo para cancelar ha expirado (2 horas)');
    }
    return this.prisma.$transaction(async (prisma) => {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      return prisma.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
      });
    });
  }
}