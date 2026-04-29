// src/modules/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Estadísticas generales
  async getStats() {
    const [
      totalUsers,
      totalStores,
      totalProducts,
      totalOrders,
      totalSales,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.store.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({ _sum: { total: true } }),
    ]);
    return {
      totalUsers,
      totalStores,
      totalProducts,
      totalOrders,
      totalSales: totalSales._sum.total || 0,
    };
  }

  // Listar usuarios (excluyendo passwords)
  async getUsers(limit = 50, offset = 0) {
    return this.prisma.user.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Cambiar rol de usuario
  async updateUserRole(userId: number, role: Role) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  // Listar tiendas con dueño
  async getStores(limit = 50, offset = 0) {
    return this.prisma.store.findMany({
      skip: offset,
      take: limit,
      include: { owner: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Eliminar tienda (solo admin)
  async deleteStore(storeId: number) {
    return this.prisma.store.delete({ where: { id: storeId } });
  }
}