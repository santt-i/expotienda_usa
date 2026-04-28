// src/features/analytics/components/OrdersStatusChart.tsx
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { COLORS } from '../../../core/theme/colors';

type Props = {
  data: { status: string; count: number; percentage: number }[];
};

const statusSpanish: Record<string, string> = {
  PENDING: 'Pendiente',
  ACCEPTED: 'Aceptado',
  PAID: 'Pagado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

function getStatusColor(status: string): string {
  switch (status) {
    case 'DELIVERED': return COLORS.success;
    case 'PAID': return COLORS.accent;
    case 'PENDING': return COLORS.warning;
    case 'CANCELLED': return COLORS.error;
    default: return COLORS.gray;
  }
}

export default function OrdersStatusChart({ data }: Props) {
  const pieData = data.map(item => ({
    name: statusSpanish[item.status] || item.status,
    population: item.count,
    color: getStatusColor(item.status),
    legendFontColor: COLORS.text,
  }));

  return (
    <View style={{ marginVertical: 16 }}>
      <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>Órdenes por estado</Text>
      <PieChart
        data={pieData}
        width={Dimensions.get('window').width - 32}
        height={200}
        chartConfig={{ color: () => COLORS.accent }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </View>
  );
}