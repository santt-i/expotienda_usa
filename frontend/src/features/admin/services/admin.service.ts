import api from '../../../core/api/axiosConfig';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
  owner: { id: number; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  totalUsers: number;
  totalStores: number;
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
}

export const adminService = {
  async getStats(): Promise<Stats> {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  async getUsers(limit = 50, offset = 0): Promise<User[]> {
    const response = await api.get(`/admin/users?limit=${limit}&offset=${offset}`);
    return response.data;
  },
  async updateUserRole(userId: number, role: string): Promise<User> {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
  async getStores(limit = 50, offset = 0): Promise<Store[]> {
    const response = await api.get(`/admin/stores?limit=${limit}&offset=${offset}`);
    return response.data;
  },
  async deleteStore(storeId: number): Promise<void> {
    await api.delete(`/admin/stores/${storeId}`);
  },
};