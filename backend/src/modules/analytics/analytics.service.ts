import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { SalesOverviewDto } from './dto/sales-overview.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSalesOverview(userId: number, userRole: string, storeId?: number): Promise<SalesOverviewDto> {
    // Si es DISTRIBUIDOR, debe pasar storeId y verificar que sea su tienda
    if (userRole === 'DISTRIBUIDOR') {
      if (!storeId) throw new ForbiddenException('Se requiere storeId');
      const store = await this.prisma.store.findUnique({ where: { id: storeId } });
      if (!store || store.ownerId !== userId) {
        throw new ForbiddenException('No tienes acceso a esta tienda');
      }
    }

    // Filtro por tienda (si se proporciona) o null para ADMIN (todas)
    const storeFilter = storeId ? { storeId } : {};

    // Órdenes completadas (pagadas y entregadas, o solo PAID según tu lógica)
    const orders = await this.prisma.order.findMany({
      where: {
        ...storeFilter,
        status: { in: [OrderStatus.PAID, OrderStatus.DELIVERED] }, // ajusta según tu flujo
      },
      select: {
        total: true,
        createdAt: true,
        items: {
          select: {
            quantity: true,
            product: { select: { id: true, name: true } },
          },
        },
      },
    });

    // Calcular totales
    const totalSales = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Top productos: sumar cantidades
    const productSales = new Map<number, { id: number; name: string; totalSold: number }>();
    for (const order of orders) {
      for (const item of order.items) {
        const pid = item.product.id;
        const existing = productSales.get(pid);
        if (existing) {
          existing.totalSold += item.quantity;
        } else {
          productSales.set(pid, {
            id: pid,
            name: item.product.name,
            totalSold: item.quantity,
          });
        }
      }
    }
    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5); // top 5

    // Ventas por día (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const salesByDay = await this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        ...storeFilter,
        status: { in: [OrderStatus.PAID, OrderStatus.DELIVERED] },
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: { total: true },
      orderBy: { createdAt: 'asc' },
    });
    // Convertir agrupación a array de { date, total }
    const salesByDayFormatted = salesByDay.map(day => ({
      date: day.createdAt.toISOString().split('T')[0],
      total: Number(day._sum.total || 0),
    }));

    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      topProducts,
      salesByDay: salesByDayFormatted,
    };
  }
}