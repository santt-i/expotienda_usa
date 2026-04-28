import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { SalesOverviewDto } from './dto/sales-overview.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  //  verifica que el distribuidor
  // solo pueda ver sus propios datos
  private async getStoreIdForUser(userId: number, userRole: string, storeId?: number): Promise<number | undefined> {
    if (userRole === 'ADMIN') {
      // Admin puede ver todo — storeId es opcional
      return storeId;
    }

    if (userRole === 'DISTRIBUIDOR') {
      // Distribuidor solo ve su tienda
      const store = await this.prisma.store.findUnique({
        where: { ownerId: userId },
      });
      if (!store) throw new ForbiddenException('No tienes una tienda asociada');
      return store.id;
    }

    throw new ForbiddenException('No tienes acceso a la analitica');
  }

  async getSalesOverview(userId: number, userRole: string, storeId?: number): Promise<SalesOverviewDto> {
    const resolvedStoreId = await this.getStoreIdForUser(userId, userRole, storeId);
    const storeFilter = resolvedStoreId ? { storeId: resolvedStoreId } : {};

    // Órdenes completadas — PAID, SHIPPED, DELIVERED cuentan como ventas
    const completedStatuses = [
      OrderStatus.PAID,
      OrderStatus.SHIPPED,
      OrderStatus.IN_TRANSIT,
      OrderStatus.DELIVERED,
    ];

    // ── MÉTRICAS GENERALES ──────────────────────────────
    const orders = await this.prisma.order.findMany({
      where: { ...storeFilter, status: { in: completedStatuses } },
      select: {
        total: true,
        createdAt: true,
        status: true,
        items: {
          select: {
            quantity: true,
            price: true,
            product: { select: { id: true, name: true } },
          },
        },
      },
    });

    const totalSales = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // ── TOP PRODUCTOS ───────────────────────────────────
    const productSales = new Map<number, {
      id: number; name: string; totalSold: number; revenue: number;
    }>();

    for (const order of orders) {
      for (const item of order.items) {
        const pid = item.product.id;
        const revenue = Number(item.price) * item.quantity;
        const existing = productSales.get(pid);
        if (existing) {
          existing.totalSold += item.quantity;
          existing.revenue += revenue;
        } else {
          productSales.set(pid, {
            id: pid,
            name: item.product.name,
            totalSold: item.quantity,
            revenue,
          });
        }
      }
    }

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    // ── VENTAS POR DÍA (últimos 30 días) ───────────────
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = await this.prisma.order.findMany({
      where: {
        ...storeFilter,
        status: { in: completedStatuses },
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Agrupamos por fecha manualmente
    // Prisma groupBy con fechas truncadas es complejo — esto es más claro
    const dayMap = new Map<string, { total: number; orders: number }>();
    for (const order of recentOrders) {
      const date = order.createdAt.toISOString().split('T')[0];
      const existing = dayMap.get(date);
      if (existing) {
        existing.total += Number(order.total);
        existing.orders += 1;
      } else {
        dayMap.set(date, { total: Number(order.total), orders: 1 });
      }
    }

    const salesByDay = Array.from(dayMap.entries()).map(([date, data]) => ({
      date,
      total: data.total,
      orders: data.orders,
    }));

    // ── ÓRDENES POR ESTADO ──────────────────────────────
    const allOrders = await this.prisma.order.findMany({
      where: storeFilter,
      select: { status: true },
    });

    const statusMap = new Map<string, number>();
    for (const order of allOrders) {
      statusMap.set(order.status, (statusMap.get(order.status) ?? 0) + 1);
    }

    const totalAllOrders = allOrders.length;
    const ordersByStatus = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
      percentage: totalAllOrders > 0
        ? Math.round((count / totalAllOrders) * 100)
        : 0,
    }));

    // ── COMPARACIÓN CON MES ANTERIOR ───────────────────
    const startOfCurrentMonth = new Date();
    startOfCurrentMonth.setDate(1);
    startOfCurrentMonth.setHours(0, 0, 0, 0);

    const startOfLastMonth = new Date(startOfCurrentMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    const currentMonthOrders = await this.prisma.order.aggregate({
      where: {
        ...storeFilter,
        status: { in: completedStatuses },
        createdAt: { gte: startOfCurrentMonth },
      },
      _sum: { total: true },
    });

    const lastMonthOrders = await this.prisma.order.aggregate({
      where: {
        ...storeFilter,
        status: { in: completedStatuses },
        createdAt: { gte: startOfLastMonth, lt: startOfCurrentMonth },
      },
      _sum: { total: true },
    });

    const currentMonth = Number(currentMonthOrders._sum.total ?? 0);
    const lastMonth = Number(lastMonthOrders._sum.total ?? 0);
    const percentageChange = lastMonth > 0
      ? Math.round(((currentMonth - lastMonth) / lastMonth) * 100)
      : 0;

    // ── EVENTOS DE COMPORTAMIENTO ───────────────────────
    const events = await this.prisma.event.groupBy({
      by: ['type'],
      _count: { type: true },
      orderBy: { _count: { type: 'desc' } },
    });

    const topEvents = events.map(e => ({
      type: e.type,
      count: e._count.type,
    }));

    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      topProducts,
      salesByDay,
      ordersByStatus,
      comparisonWithLastMonth: { currentMonth, lastMonth, percentageChange },
      topEvents,
    };
  }
}