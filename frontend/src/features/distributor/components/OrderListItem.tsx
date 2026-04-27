import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Order } from '../../orders/services/orders.service';
import { COLORS } from '../../../core/theme/colors';
import { formatCurrency } from '../../../utils/formatters';

type Props = {
  order: Order;
  onUpdateStatus: (orderId: number, status: string, trackingCode?: string) => void;
};

export default function OrderListItem({ order, onUpdateStatus }: Props) {
  const [showTracking, setShowTracking] = useState(false);
  const [trackingCode, setTrackingCode] = useState(order.trackingCode || '');

  const handleStatusChange = (status: string) => {
    if (status === 'SHIPPED' && !trackingCode) {
      Alert.alert('Requerido', 'Ingresa el número de seguimiento');
      setShowTracking(true);
      return;
    }
    onUpdateStatus(order.id, status, status === 'SHIPPED' ? trackingCode : undefined);
    setShowTracking(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.orderId}>Orden #{order.id}</Text>
      <Text style={styles.customer}>Cliente: {order.buyer?.name || 'N/A'}</Text>
      <Text style={styles.total}>{formatCurrency(order.total)}</Text>
      <Text style={styles.status}>Estado: {order.status}</Text>
      {showTracking && (
        <TextInput
          style={styles.input}
          placeholder="Número de seguimiento"
          value={trackingCode}
          onChangeText={setTrackingCode}
        />
      )}
      <View style={styles.actions}>
        {order.status === 'PENDING' && (
          <TouchableOpacity style={styles.acceptButton} onPress={() => handleStatusChange('ACCEPTED')}>
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        )}
        {order.status === 'ACCEPTED' && (
          <TouchableOpacity style={styles.shipButton} onPress={() => handleStatusChange('SHIPPED')}>
            <Text style={styles.buttonText}>Marcar enviado</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.white, borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 0.5, borderColor: COLORS.border },
  orderId: { fontSize: 14, fontWeight: '500', color: COLORS.text, marginBottom: 4 },
  customer: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 2 },
  total: { fontSize: 14, color: COLORS.accent, marginBottom: 4 },
  status: { fontSize: 12, marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  acceptButton: { backgroundColor: COLORS.accent, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  shipButton: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  buttonText: { color: COLORS.white, fontSize: 12, fontWeight: '500' },
  input: { borderWidth: 0.5, borderColor: COLORS.border, borderRadius: 8, padding: 8, marginVertical: 8 },
});