import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../../core/context/AuthContext';
import { distributorService, DashboardMetrics } from '../services/distributor.service';
import MetricCard from '../components/MetricCard';
import CreateStoreForm from '../components/CreateStoreForm';
import { COLORS } from '../../../core/theme/colors';

export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const store = await distributorService.getMyStore();
      if (!store) {
        setHasStore(false);
        setLoading(false);
        return;
      }
      setHasStore(true);
      const data = await distributorService.getDashboardMetrics();
      setMetrics(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStoreCreated = async (store: { id: number; name: string }) => {
    setHasStore(true);
    setLoading(true);
    try {
      const data = await distributorService.getDashboardMetrics();
      setMetrics(data);
    } catch {
      setMetrics({ totalSales: 0, pendingOrders: 0, lowStockProducts: 0, totalProducts: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  if (hasStore === false) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <CreateStoreForm onStoreCreated={handleStoreCreated} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.welcome}>¡Hola, {user?.name}!</Text>
        <Text style={styles.subtitle}>Resumen de tu negocio</Text>

        <View style={styles.metricsGrid}>
          <MetricCard
            title="Ventas del mes"
            value={`$${metrics?.totalSales?.toLocaleString() ?? 0}`}
            icon="cash-outline"
            color={COLORS.accent}
          />
          <MetricCard
            title="Órdenes pendientes"
            value={metrics?.pendingOrders?.toString() ?? '0'}
            icon="alert-circle-outline"
            color={COLORS.error}
          />
          <MetricCard
            title="Bajo stock"
            value={metrics?.lowStockProducts?.toString() ?? '0'}
            icon="cube-outline"
            color={COLORS.error}
          />
          <MetricCard
            title="Productos activos"
            value={metrics?.totalProducts?.toString() ?? '0'}
            icon="storefront-outline"
            color={COLORS.primaryDark}
          />
        </View>

        <View style={styles.actions}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('ProductManagement')}
            >
              <Text style={styles.actionText}>Gestionar productos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('OrderManagement')}
            >
              <Text style={styles.actionText}>Ver órdenes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  scrollContent: { padding: 20 },
  welcome: { fontSize: 24, fontWeight: '500', color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 24 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  actions: { marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '500', color: COLORS.text, marginBottom: 16 },
  actionButtons: { gap: 12 },
  actionButton: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  actionText: { fontSize: 16, color: COLORS.text, textAlign: 'center' },
});