import api from '../../../core/api/axiosConfig';

export interface Product {
  id: number;
  name: string;
  description?: string;
  priceCOP: number;
  stock: number;
  images: string[];
  storeId: number;
  store?: { id: number; name: string };
  categoryId?: number;        
  category?: {                
    id: number;
    name: string;
    icon: string;
    slug: string;
  };
}

export interface Store {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
  products?: Product[];
}

export const productsService = {
  async getProducts(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data;
  },

  async getProductById(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async getStores(): Promise<Store[]> {
    const response = await api.get('/stores');
    return response.data;
  },
};