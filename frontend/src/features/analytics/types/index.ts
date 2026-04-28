export interface SalesOverview {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: TopProduct[];
  salesByDay: SalesByDay[];
  ordersByStatus: OrdersByStatus[];
  comparisonWithLastMonth: Comparison;
  topEvents: TopEvent[];
}

export interface TopProduct {
  id: number;
  name: string;
  totalSold: number;
  revenue: number;
}

export interface SalesByDay {
  date: string;    // formato 'YYYY-MM-DD'
  total: number;
  orders: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface Comparison {
  currentMonth: number;
  lastMonth: number;
  percentageChange: number;
}

export interface TopEvent {
  type: string;
  count: number;
}