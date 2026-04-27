import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Order } from '../../orders/services/orders.service';
import { distributorService } from '../services/distributor.service';
import OrderListItem from '../components/OrderListItem';
import { COLORS } from '../../../core/theme/colors';

export default function OrdersManagementScreen({ navigation }: any) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await distributorService.getMyStoreOrders();
      setOrders(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, status: string, trackingCode?: string) => {
    try {
      await distributorService.updateOrderStatus(orderId, status, trackingCode);
      loadOrders();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado');
    }
  };

  const renderItem = ({ item }: { item: Order }) => (
    <OrderListItem order={item} onUpdateStatus={handleUpdateStatus} />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Text style={styles.title}>Órdenes recibidas</Text>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} style={styles.loader} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay órdenes aún</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  title: { fontSize: 20, fontWeight: '500', color: COLORS.text, marginBottom: 16 },
  list: { paddingBottom: 20 },
  loader: { marginTop: 20 },
  emptyText: { textAlign: 'center', marginTop: 40, color: COLORS.textSecondary },
});