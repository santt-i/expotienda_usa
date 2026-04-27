import api from '../../../core/api/axiosConfig';

export interface Category {
  id: number;
  name: string;
  icon: string;
  slug: string;
  _count: {
    products: number; 
  };
}

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  },
};