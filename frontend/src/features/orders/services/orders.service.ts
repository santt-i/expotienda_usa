import api from '../../../core/api/axiosConfig';

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: { name: string; images: string[] };
}

export interface Order {
  id: number;
  buyerId: number;
  storeId: number;
  status: string;
  total: number;
  createdAt: string;
  trackingCode?: string;
  items: OrderItem[];
  store: { name: string };
  buyer?: { id: number; name: string; email: string }; 
}

export const ordersService = {
  async getMyOrders(): Promise<Order[]> {
    const response = await api.get('/orders/my');
    return response.data;
  },

  async getOrderById(id: number): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async cancelOrder(orderId: number): Promise<void> {
  await api.put(`/orders/${orderId}/cancel`);
}
};