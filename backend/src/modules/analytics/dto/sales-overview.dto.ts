export class SalesOverviewDto {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: {
    id: number;
    name: string;
    totalSold: number;
    revenue: number; // ingresos generados por ese producto
  }[];
  salesByDay: {
    date: string;
    total: number;
    orders: number; // cuántas órdenes ese día
  }[];
  ordersByStatus: {
    status: string;
    count: number;
    percentage: number; // para la gráfica de dona
  }[];
  comparisonWithLastMonth: {
    currentMonth: number;
    lastMonth: number;
    percentageChange: number; // positivo = creció, negativo = bajó
  };
  topEvents: {
    type: string;
    count: number;
  }[];
}