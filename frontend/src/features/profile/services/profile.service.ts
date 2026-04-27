import api from '../../../core/api/axiosConfig';

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/users/me');
    return response.data;
  },

  async updateProfile(data: Partial<Omit<UserProfile, 'id' | 'role' | 'createdAt' | 'updatedAt'>>) {
    const response = await api.put('/users/me', data);
    return response.data;
  },
};