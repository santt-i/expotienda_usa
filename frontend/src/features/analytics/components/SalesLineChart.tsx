import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../../../core/theme/colors';

const screenWidth = Dimensions.get('window').width;

type Props = {
  data: { date: string; total: number; orders: number }[];
  label?: string;
};

export default function SalesLineChart({ data, label = 'Ventas por día' }: Props) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay datos de ventas</Text>
      </View>
    );
  }

  // Tomamos solo los últimos 30 días (máximo) y ordenamos por fecha
  const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const chartData = sorted.slice(-30);
  const labels = chartData.map(item => item.date.slice(5)); // 'MM-DD'
  const values = chartData.map(item => item.total);

  const chartConfig = {
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    color: (opacity = 1) => `rgba(61, 170, 53, ${opacity})`,
    labelColor: (opacity = 1) => COLORS.textSecondary,
    style: { borderRadius: 16 },
    propsForDots: { r: '4', strokeWidth: '2', stroke: COLORS.accent },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{label}</Text>
      <LineChart
        data={{ labels, datasets: [{ data: values, strokeWidth: 2 }] }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        formatYLabel={(y) => `$${parseInt(y).toLocaleString()}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  title: { fontSize: 16, fontWeight: '500', color: COLORS.text, marginBottom: 12 },
  chart: { marginVertical: 8, borderRadius: 16 },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { color: COLORS.textSecondary },
});