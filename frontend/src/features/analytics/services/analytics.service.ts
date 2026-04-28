import api from '../../../core/api/axiosConfig';

export interface SalesOverview {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    id: number;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
  salesByDay: Array<{
    date: string;
    total: number;
    orders: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  comparisonWithLastMonth: {
    currentMonth: number;
    lastMonth: number;
    percentageChange: number;
  };
  topEvents: Array<{
    type: string;
    count: number;
  }>;
}

export const analyticsService = {
  async getOverview(): Promise<SalesOverview> {
    const response = await api.get('/analytics/overview');
    return response.data;
  },
};