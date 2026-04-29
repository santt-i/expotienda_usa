// src/modules/chat/chat.service.ts
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface SaveMessageDto {
  senderId: number;
  receiverId: number;
  content: string;
  contextType?: string;
  contextId?: number;
}

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(data: SaveMessageDto) {
    return this.prisma.message.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        contextType: data.contextType,
        contextId: data.contextId,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async saveQuoteMessage(data: {
    senderId: number;
    receiverId: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }) {
    return this.prisma.message.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: `Cotización: ${data.productName} x${data.quantity} = ${(data.price * data.quantity).toFixed(2)}`,
        isQuote: true,
        quoteProductId: data.productId,
        quoteProductName: data.productName,
        quotePrice: data.price,
        quoteQuantity: data.quantity,
        quoteStatus: 'pending',
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getConversations(userId: number) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });

    const conversationMap = new Map<number, any>();
    for (const msg of messages) {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversationMap.has(otherUserId)) {
        const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
        conversationMap.set(otherUserId, {
          userId: otherUser.id,
          name: otherUser.name,
          email: otherUser.email,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
        });
      }
    }
    return Array.from(conversationMap.values());
  }

  async getMessages(userId: number, otherUserId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });
  }

  async acceptQuote(messageId: number, userId: number) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });
    if (!message) throw new NotFoundException('Mensaje no encontrado');
    if (message.receiverId !== userId) {
      throw new ForbiddenException('No tienes permiso para aceptar esta cotización');
    }
    if (!message.isQuote) {
      throw new BadRequestException('Este mensaje no es una cotización');
    }
    if (message.quoteStatus !== 'pending') {
      throw new BadRequestException('Esta cotización ya fue procesada');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { quoteStatus: 'accepted' },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });
  }
}