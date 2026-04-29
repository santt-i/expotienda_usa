import api from '../../../core/api/axiosConfig';

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
  isQuote?: boolean;
  quoteProductId?: number;
  quoteProductName?: string;
  quotePrice?: number;
  quoteQuantity?: number;
  quoteStatus?: string;
}

export interface Conversation {
  userId: number;
  name: string;
  email: string;
  lastMessage: string;
  lastMessageTime: string;
}

export const chatService = {
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get('/chat/conversations');
    return response.data;
  },
  async getMessages(otherUserId: number): Promise<Message[]> {
    const response = await api.get(`/chat/messages/${otherUserId}`);
    return response.data;
  },
  async acceptQuote(messageId: number): Promise<void> {
    await api.put(`/chat/messages/${messageId}/accept-quote`);
  },
};