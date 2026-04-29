import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../../core/api/axiosConfig';

type MessageHandler = (data: any) => void;

class SocketService {
  private socket: Socket | null = null;
  private messageHandlers: MessageHandler[] = [];

  async connect(): Promise<void> {
    const token = await AsyncStorage.getItem('@access_token');
    if (!token) {
      console.warn('Socket: No token');
      return;
    }

    if (this.socket?.connected) return;

    this.socket = io(`${API_BASE_URL}/chat`, {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,      // reconectar automáticamente
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Eventos de conexión (sin errores ruidosos)
    this.socket.on('connect', () => {
      console.log('Socket: Conectado');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket: Desconectado', reason);
    });

    // Eventos de error silenciados (solo debug)
    this.socket.on('connect_error', (error) => {
      console.debug('Socket: Error de conexión (no crítico)', error.message);
    });

    this.socket.on('error', (error) => {
      console.debug('Socket: Error (no crítico)', error.message);
    });

    // Mensajes entrantes
    this.socket.on('newMessage', (data) => {
      this.messageHandlers.forEach(handler => handler(data));
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(receiverId: number, content: string, contextType?: string, contextId?: number): void {
    if (!this.socket?.connected) {
      console.warn('Socket: No conectado');
      return;
    }
    this.socket.emit('sendMessage', { receiverId, content, contextType, contextId });
  }

  sendQuote(receiverId: number, productId: number, quantity: number, price?: number): void {
    if (!this.socket?.connected) {
      console.warn('Socket: No conectado');
      return;
    }
    this.socket.emit('sendQuote', { receiverId, productId, quantity, price });
  }

  onNewMessage(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
  }

  offNewMessage(handler: MessageHandler): void {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();