export class SalesOverviewDto {
  totalSales: number;        // suma de total de órdenes completadas
  totalOrders: number;       // cantidad de órdenes completadas
  averageOrderValue: number; // totalSales / totalOrders
  topProducts: { id: number; name: string; totalSold: number }[];
  salesByDay: { date: string; total: number }[];
}