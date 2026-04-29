import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, title: string, body: string, type: string, data?: any) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        body,
        type,
        data: data || {},
      },
    });
  }

  async getByUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount(userId: number) {
    return this.prisma.notification.count({
      where: { userId, read: false },
    });
  }

  async markAsRead(notificationId: number, userId: number) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  // Método para crear notificación de nuevo mensaje (llamado desde chat)
  async notifyNewMessage(senderId: number, receiverId: number, messageId: number) {
    // Obtener nombre del remitente
    const sender = await this.prisma.user.findUnique({ where: { id: senderId } });
    if (!sender) return;
    await this.create(
      receiverId,
      `Nuevo mensaje de ${sender.name}`,
      'Tienes un nuevo mensaje en el chat',
      'message',
      { messageId, senderId },
    );
  }

  // Método para crear notificación de cambio de estado de orden
  async notifyOrderStatusChange(orderId: number, buyerId: number, status: string) {
    await this.create(
      buyerId,
      `Orden #${orderId} actualizada`,
      `El estado de tu orden ha cambiado a ${status}`,
      'order_status',
      { orderId, status },
    );
  }
}