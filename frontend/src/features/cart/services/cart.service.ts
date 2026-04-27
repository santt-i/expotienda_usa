import api from '../../../core/api/axiosConfig';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    priceCOP: number;
    images: string[];
    storeId: number;
    store?: { name: string };
  };
}

export const cartService = {
  async getCart(): Promise<{ items: CartItem[]; total: number }> {
    const response = await api.get('/cart');
    return response.data;
  },

  async addItem(productId: number, quantity: number): Promise<CartItem> {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },

  async updateItem(itemId: number, quantity: number): Promise<CartItem> {
    const response = await api.put(`/cart/item/${itemId}`, { quantity });
    return response.data;
  },

  async removeItem(itemId: number): Promise<void> {
    await api.delete(`/cart/item/${itemId}`);
  },

  async clearCart(): Promise<void> {
    await api.delete('/cart/clear');
  },

  async checkout(): Promise<{ orderId: number; total: number }> {
    const response = await api.post('/cart/checkout');
    return response.data;
  },
};