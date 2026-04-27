import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ordersService, Order } from '../services/orders.service';
import { COLORS } from '../../../core/theme/colors';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    ordersService.getMyOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.accent} style={styles.center} />;
  }

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <Text style={styles.emptyText}>No tienes órdenes aún</Text>
      </SafeAreaView>
    );
  }

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => (navigation as any).navigate('OrderDetail', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Orden #{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'DELIVERED' ? COLORS.accentLight : COLORS.border }]}>
          <Text style={[styles.statusText, { color: item.status === 'DELIVERED' ? COLORS.accent : COLORS.textSecondary }]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      <Text style={styles.orderTotal}>Total: ${item.total.toLocaleString()}</Text>
      <Text style={styles.storeName}>Tienda: {item.store.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  list: { padding: 16, paddingBottom: 20 },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderId: { fontSize: 14, fontWeight: '500', color: COLORS.text },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '500' },
  orderDate: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  orderTotal: { fontSize: 14, fontWeight: '500', color: COLORS.accent, marginBottom: 4 },
  storeName: { fontSize: 12, color: COLORS.textSecondary },
  emptyText: { fontSize: 16, color: COLORS.textSecondary },
});