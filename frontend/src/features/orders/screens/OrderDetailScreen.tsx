import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { ordersService, Order } from '../services/orders.service';
import { COLORS } from '../../../core/theme/colors';
import { formatCurrency } from '../../../utils/formatters';

export default function OrderDetailScreen() {
  const route = useRoute();
  const { orderId } = route.params as { orderId: number };
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersService.getOrderById(orderId)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.center} edges={['top', 'bottom']}>
        <Text>Orden no encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>Orden #{order.id}</Text>
        <Text style={styles.status}>Estado: {order.status}</Text>
        <Text style={styles.date}>Fecha: {new Date(order.createdAt).toLocaleString()}</Text>
        <Text style={styles.store}>Tienda: {order.store.name}</Text>
        <Text style={styles.sectionTitle}>Productos</Text>
        <FlatList
          data={order.items}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>{item.product.name}</Text>
              <Text style={styles.itemQty}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false} // porque ya está dentro de un ScrollView (opcional)
        />
        <Text style={styles.total}>Total: {formatCurrency(order.total)}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '500', color: COLORS.text, marginBottom: 8 },
  status: { fontSize: 14, color: COLORS.accent, marginBottom: 4 },
  date: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  store: { fontSize: 14, color: COLORS.text, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: COLORS.text, marginBottom: 8 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  itemName: { flex: 2, fontSize: 14 },
  itemQty: { width: 40, textAlign: 'center', fontSize: 14 },
  itemPrice: { width: 80, textAlign: 'right', fontSize: 14, color: COLORS.accent, fontWeight: '500' },
  total: { fontSize: 18, fontWeight: '500', color: COLORS.accent, textAlign: 'right', marginTop: 16 },
});