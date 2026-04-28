import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyticsService, SalesOverview } from '../services/analytics.service';
import MetricCard from '../components/MetricCard';
import SalesLineChart from '../components/SalesLineChart';
import OrdersStatusChart from '../components/OrdersStatusChart';
import { COLORS } from '../../../core/theme/colors';

export default function AnalyticsScreen() {
  const [data, setData] = useState<SalesOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getOverview()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No se pudieron cargar los datos</Text>
      </SafeAreaView>
    );
  }

  const { totalSales, totalOrders, averageOrderValue, salesByDay, ordersByStatus } = data;

  // Asegurar que los valores sean números (pueden venir como string desde la API)
  const safeValue = (val: any): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return parseFloat(val) || 0;
    return 0;
  };

  const salesNumber = safeValue(totalSales);
  const ordersNumber = safeValue(totalOrders);
  const avgNumber = safeValue(averageOrderValue);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Analítica de ventas</Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <MetricCard title="Ventas totales" value={salesNumber} prefix="$" />
          </View>
          <View style={styles.metricItem}>
            <MetricCard title="Órdenes" value={ordersNumber} />
          </View>
          <View style={styles.metricItem}>
            <MetricCard title="Ticket promedio" value={avgNumber} prefix="$" />
          </View>
        </View>

        <SalesLineChart data={salesByDay} />
        <OrdersStatusChart data={ordersByStatus} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingTop: 20 },
  header: { fontSize: 24, fontWeight: '500', marginBottom: 16, color: COLORS.text },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  metricItem: { flex: 1, marginHorizontal: 4 },
});