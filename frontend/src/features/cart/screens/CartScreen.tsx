import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { cartService, CartItem } from '../services/cart.service';
import { COLORS } from '../../../core/theme/colors';
import { formatCurrency } from '../../../utils/formatters';

export default function CartScreen({ navigation }: any) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const recalcTotal = (cartItems: CartItem[]) => {
    const newTotal = cartItems.reduce((sum, item) => sum + (item.product?.priceCOP ?? 0) * item.quantity, 0);
    setTotal(newTotal);
  };

  const loadCart = async () => {
    try {
      const cart = await cartService.getCart();
      const cartItems = cart.items || [];
      setItems(cartItems);
      recalcTotal(cartItems);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await cartService.updateItem(itemId, newQuantity);
      const updatedItems = items.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setItems(updatedItems);
      recalcTotal(updatedItems);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la cantidad');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    Alert.alert('Confirmar', '¿Eliminar producto del carrito?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await cartService.removeItem(itemId);
            const newItems = items.filter(item => item.id !== itemId);
            setItems(newItems);
            recalcTotal(newItems);
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el producto');
          }
        },
      },
    ]);
  };

  const handleCheckout = async () => {
    try {
      await cartService.checkout();
      Alert.alert('Éxito', 'Orden creada correctamente');
      navigation.navigate('MainTabs', { screen: 'Órdenes' });
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar la compra');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.accent} style={styles.center} />;
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <Text style={styles.emptyText}>Tu carrito está vacío</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <Text style={styles.itemPrice}>{formatCurrency(item.product.priceCOP)}</Text>
      </View>
      <View style={styles.itemActions}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
            <Ionicons name="remove-circle-outline" size={28} color={COLORS.accent} />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
            <Ionicons name="add-circle-outline" size={28} color={COLORS.accent} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
          <Ionicons name="trash-outline" size={24} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Proceder al pago</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  cartItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '500', color: COLORS.text, marginBottom: 4 },
  itemPrice: { fontSize: 14, color: COLORS.accent, fontWeight: '500' },
  itemActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  quantity: { fontSize: 16, minWidth: 24, textAlign: 'center' },
  footer: {
    padding: 16,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  totalLabel: { fontSize: 16, color: COLORS.textSecondary },
  totalValue: { fontSize: 24, fontWeight: '500', color: COLORS.accent, marginVertical: 8 },
  checkoutButton: { backgroundColor: COLORS.accent, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  checkoutText: { color: COLORS.white, fontSize: 16, fontWeight: '500' },
  emptyText: { fontSize: 16, color: COLORS.textSecondary },
});