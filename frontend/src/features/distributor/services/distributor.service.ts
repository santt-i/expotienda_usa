import api from '../../../core/api/axiosConfig';
import { Product } from '../../products/services/products.service';
import { Order } from '../../orders/services/orders.service';

export interface DashboardMetrics {
  totalSales: number;
  pendingOrders: number;
  lowStockProducts: number;
  totalProducts: number;
}

export interface CreateProductData {
  name: string;
  description?: string;
  priceCOP: number;
  stock: number;
  storeId: number;
}

export const distributorService = {
  // Obtener métricas del dashboard
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await api.get('/distributor/metrics');
    return response.data;
  },

  // Obtener la tienda del distribuidor
  async getMyStore(): Promise<{ id: number; name: string; description?: string } | null> {
    try {
      const response = await api.get('/distributor/store');
      return response.data;
    }  catch (error: any) {
    // 404 significa que no tiene tienda — no es un error real
      if (error?.response?.status === 404) return null;
      throw error;
    }
  },

  // Crear la tienda del distribuidor
  async createStore(data: { name: string; description?: string }): Promise<{ id: number; name: string }> {
    const response = await api.post('/stores', data);
    return response.data;
    },

  

  // Obtener productos de la tienda del distribuidor
  async getMyProducts(): Promise<Product[]> {
    const response = await api.get('/distributor/products');
    return response.data;
  },

  // Crear producto
  async createProduct(data: CreateProductData): Promise<Product> {
    const response = await api.post('/products', data);
    return response.data;
  },

  // Actualizar producto
  async updateProduct(id: number, data: Partial<CreateProductData>): Promise<Product> {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Eliminar producto
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  // Obtener órdenes de la tienda del distribuidor
  async getMyStoreOrders(): Promise<Order[]> {
    const response = await api.get('/distributor/orders');
    return response.data;
  },

  // Actualizar estado de una orden (y tracking)
  async updateOrderStatus(orderId: number, status: string, trackingCode?: string): Promise<Order> {
    const response = await api.put(`/orders/${orderId}/status`, { status, trackingCode });
    return response.data;
  },
};