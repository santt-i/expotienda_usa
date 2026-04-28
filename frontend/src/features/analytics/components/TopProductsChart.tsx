import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../../core/theme/colors';
import { formatCurrency } from '../../../utils/formatters';

type Props = {
  products: { id: number; name: string; totalSold: number; revenue: number }[];
};

export default function TopProductsChart({ products }: Props) {
  if (!products || products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay productos vendidos</Text>
      </View>
    );
  }

  // Encontrar el máximo de ventas para escalar las barras visualmente
  const maxRevenue = Math.max(...products.map(p => p.revenue));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top productos más vendidos</Text>
      {products.map((product, idx) => (
        <View key={product.id} style={styles.productRow}>
          <Text style={styles.rank}>{idx + 1}</Text>
          <View style={styles.info}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  { width: `${(product.revenue / maxRevenue) * 100}%`, backgroundColor: COLORS.accent },
                ]}
              />
            </View>
            <View style={styles.stats}>
              <Text style={styles.statsText}>Unidades: {product.totalSold}</Text>
              <Text style={styles.statsText}>Ingresos: {formatCurrency(product.revenue)}</Text>
            </View>
          </View>
        </View>
      ))}
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
  productRow: { flexDirection: 'row', marginBottom: 16, gap: 12 },
  rank: { fontSize: 18, fontWeight: '500', color: COLORS.textSecondary, width: 30 },
  info: { flex: 1 },
  productName: { fontSize: 14, fontWeight: '500', color: COLORS.text, marginBottom: 4 },
  barContainer: { height: 8, backgroundColor: COLORS.lightGray, borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  bar: { height: 8, borderRadius: 4 },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  statsText: { fontSize: 10, color: COLORS.textSecondary },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { color: COLORS.textSecondary },
});