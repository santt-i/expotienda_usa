import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class DistributorService {
  constructor(private prisma: PrismaService) {}

  // Obtener la tienda asociada al usuario distribuidor
async getStoreByUserId(userId: number) {
    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId },
    });
    if (!store) {
      throw new NotFoundException('No tienes una tienda asociada. Crea una tienda primero.');
    }
    return store;
  }

  // Métricas del dashboard
  async getMetrics(userId: number) {
    const store = await this.getStoreByUserId(userId);

    // Total de ventas del mes actual (órdenes con estado PAID, SHIPPED, DELIVERED)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const salesResult = await this.prisma.order.aggregate({
      where: {
        storeId: store.id,
        status: { in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED] },
        createdAt: { gte: startOfMonth },
      },
      _sum: { total: true },
    });
    const totalSales = salesResult._sum.total || 0;

    // Órdenes pendientes (PENDING)
    const pendingOrders = await this.prisma.order.count({
      where: { storeId: store.id, status: OrderStatus.PENDING },
    });

    // Productos con bajo stock (stock < 10)
    const lowStockProducts = await this.prisma.product.count({
      where: { storeId: store.id, stock: { lt: 10 } },
    });

    // Productos activos totales
    const totalProducts = await this.prisma.product.count({
      where: { storeId: store.id },
    });

    return {
      totalSales,
      pendingOrders,
      lowStockProducts,
      totalProducts,
    };
  }

  // Obtener productos de la tienda
  async getMyProducts(userId: number) {
    const store = await this.getStoreByUserId(userId);
    return this.prisma.product.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Obtener órdenes de la tienda (con información del comprador)
  async getMyStoreOrders(userId: number) {
    const store = await this.getStoreByUserId(userId);
    return this.prisma.order.findMany({
      where: { storeId: store.id },
      include: {
        buyer: {
          select: { id: true, name: true, email: true },
        },
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}