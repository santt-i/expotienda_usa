export const translateOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: 'Pendiente',
    ACCEPTED: 'Aceptado',
    PAID: 'Pagado',
    SHIPPED: 'Enviado',
    IN_TRANSIT: 'En tránsito',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  };
  return statusMap[status] || status;
};