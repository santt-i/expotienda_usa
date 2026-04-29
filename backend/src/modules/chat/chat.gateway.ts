import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { SendQuoteDto } from './dto/send-quote.dto'; // ← importar
import * as jwt from 'jsonwebtoken';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../../prisma/prisma.service'; // ← importar

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private chatService: ChatService,
    private notificationsService: NotificationsService,
    private prisma: PrismaService, // ← ahora sí existe
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET missing');
      const payload = jwt.verify(token, secret) as any;
      client.data.userId = payload.sub;
      client.join(`user:${client.data.userId}`);
      console.log(`✅ Usuario ${client.data.userId} conectado`);
    } catch (error) {
      console.error(`❌ Error de autenticación: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Usuario ${client.data.userId} desconectado`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageDto,
  ) {
    const senderId = client.data.userId;
    if (!senderId) return;

    const message = await this.chatService.saveMessage({
      senderId,
      receiverId: data.receiverId,
      content: data.content,
      contextType: data.contextType,
      contextId: data.contextId,
    });

    // Notificar al receptor
    await this.notificationsService.notifyNewMessage(senderId, data.receiverId, message.id);

    // Emitir solo al receptor
    this.server.to(`user:${data.receiverId}`).emit('newMessage', message);
  }

  @SubscribeMessage('sendQuote')
  async handleSendQuote(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendQuoteDto,
  ) {
    const senderId = client.data.userId;
    if (!senderId) return;

    // Obtener el producto
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!product) {
      client.emit('error', { message: 'Producto no encontrado' });
      return;
    }

    const price = data.price ?? Number(product.priceCOP);

    const message = await this.chatService.saveQuoteMessage({
      senderId,
      receiverId: data.receiverId,
      productId: data.productId,
      productName: product.name,
      quantity: data.quantity,
      price,
    });

    // Emitir al receptor
    this.server.to(`user:${data.receiverId}`).emit('newMessage', message);
    // Confirmación al emisor
    client.emit('messageSent', message);
  }
}