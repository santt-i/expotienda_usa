import api from '../../../core/api/axiosConfig';

export interface Notification {
  id: number;
  title: string;
  body: string;
  type: string;
  data: any;
  read: boolean;
  createdAt: string;
}

export const notificationsService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get('/notifications');
    return response.data;
  },
  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  },
  async markAsRead(id: number): Promise<void> {
    await api.put(`/notifications/${id}/read`);
  },
  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  },
};