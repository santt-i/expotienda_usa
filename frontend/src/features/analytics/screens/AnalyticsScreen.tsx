import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../core/context/AuthContext';
import { analyticsService } from '../services/analytics.service';
import { SalesOverview } from '../types';
import MetricCard from '../components/MetricCard';
import SalesLineChart from '../components/SalesLineChart';
import TopProductsChart from '../components/TopProductsChart';
import OrdersStatusChart from '../components/OrdersStatusChart';
import ComparisonCard from '../components/ComparisonCard';
import { COLORS } from '../../../core/theme/colors';
import { formatCurrency } from '../../../utils/formatters';

export default function AnalyticsScreen() {
  const { user } = useAuth();
  const [data, setData] = useState<SalesOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const overview = await analyticsService.getOverview();
      setData(overview);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text>No se pudieron cargar los datos</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.accent]} />}
      >
        <Text style={styles.header}>Analítica de ventas</Text>

        {/* Fila de métricas principales */}
        <View style={styles.metricsRow}>
          <MetricCard
            title="Ventas totales"
            value={formatCurrency(data.totalSales)}
            icon="cash-outline"
            trend={data.comparisonWithLastMonth.percentageChange}
            trendLabel="vs mes anterior"
          />
          <MetricCard
            title="Órdenes completadas"
            value={data.totalOrders.toString()}
            icon="checkmark-circle-outline"
          />
          <MetricCard
            title="Valor promedio"
            value={formatCurrency(data.averageOrderValue)}
            icon="stats-chart-outline"
          />
        </View>

        {/* Comparación mensual (detallada) */}
        <ComparisonCard
          currentMonth={data.comparisonWithLastMonth.currentMonth}
          lastMonth={data.comparisonWithLastMonth.lastMonth}
          percentageChange={data.comparisonWithLastMonth.percentageChange}
        />

        {/* Gráfica de línea: ventas por día */}
        <SalesLineChart data={data.salesByDay} label="Ventas por día (últimos 30 días)" />

        {/* Top productos */}
        <TopProductsChart products={data.topProducts} />

        {/* Órdenes por estado (dona) */}
        <OrdersStatusChart data={data.ordersByStatus} />

        {/* Eventos de comportamiento (opcional, lista) */}
        {data.topEvents.length > 0 && (
          <View style={styles.eventsContainer}>
            <Text style={styles.sectionTitle}>Eventos de usuarios</Text>
            {data.topEvents.map(event => (
              <View key={event.type} style={styles.eventRow}>
                <Text style={styles.eventType}>{event.type}</Text>
                <Text style={styles.eventCount}>{event.count}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 24, fontWeight: '500', color: COLORS.text, marginBottom: 16 },
  metricsRow: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6, marginBottom: 16 },
  eventsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: COLORS.text, marginBottom: 12 },
  eventRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  eventType: { fontSize: 14, color: COLORS.text },
  eventCount: { fontSize: 14, fontWeight: '500', color: COLORS.accent },
});