import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';
import { useAuth } from '../../../core/context/AuthContext';
import api from '../../../core/api/axiosConfig';
import { COLORS } from '../../../core/theme/colors';

interface SalesOverview {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: { id: number; name: string; totalSold: number }[];
  salesByDay: { date: string; total: number }[];
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const [data, setData] = useState<SalesOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = user?.role === 'DISTRIBUIDOR'
          ? `/analytics/sales-overview?storeId=${user?.storeId}` // asumiendo que el usuario tiene storeId
          : '/analytics/sales-overview';
        const response = await api.get(endpoint);
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <ActivityIndicator size="large" color={COLORS.accent} style={{ flex: 1 }} />;

  if (!data) return <Text style={styles.error}>No se pudieron cargar los datos</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard de Ventas</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumen</Text>
        <Text style={styles.stat}>Ventas totales: ${data.totalSales.toLocaleString()}</Text>
        <Text style={styles.stat}>Órdenes: {data.totalOrders}</Text>
        <Text style={styles.stat}>Valor promedio: ${data.averageOrderValue.toLocaleString()}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ventas por día (últimos 30 días)</Text>
        <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
          <VictoryAxis tickFormat={(tick) => tick.slice(5, 10)} />
          <VictoryAxis dependentAxis />
          <VictoryBar
            data={data.salesByDay.map(item => ({ x: item.date, y: item.total }))}
            style={{ data: { fill: COLORS.accent } }}
          />
        </VictoryChart>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top 5 productos más vendidos</Text>
        {data.topProducts.map(product => (
          <View key={product.id} style={styles.productRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productSold}>{product.totalSold} unidades</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  title: { fontSize: 22, fontWeight: '500', color: COLORS.text, marginBottom: 16 },
  card: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 0.5, borderColor: COLORS.border },
  cardTitle: { fontSize: 16, fontWeight: '500', color: COLORS.text, marginBottom: 12 },
  stat: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  productRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  productName: { fontSize: 14, color: COLORS.text },
  productSold: { fontSize: 14, color: COLORS.accent, fontWeight: '500' },
  error: { textAlign: 'center', marginTop: 20, color: COLORS.error },
});