import api from '../../../core/api/axiosConfig';

export interface Address {
  id: number;
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  isDefault: boolean;
}

export const addressesService = {
  async getAll(): Promise<Address[]> {
    const response = await api.get('/addresses');
    return response.data;
  },

  async create(data: Omit<Address, 'id' | 'isDefault'>): Promise<Address> {
    const response = await api.post('/addresses', data);
    return response.data;
  },

  async update(id: number, data: Partial<Address>): Promise<Address> {
    const response = await api.put(`/addresses/${id}`, data);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },

  async setDefault(id: number): Promise<Address> {
    const response = await api.patch(`/addresses/${id}/default`);
    return response.data;
  },
};