import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { productsService, Product } from '../services/products.service';
import { cartService } from '../../cart/services/cart.service';
import { COLORS } from '../../../core/theme/colors';
import { formatCurrency } from '../../../utils/formatters';

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { productId } = route.params as { productId: number };
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsService.getProductById(productId)
      .then(setProduct)
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'No se pudo cargar el producto');
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      await cartService.addItem(productId, quantity);
      Alert.alert('Éxito', 'Producto agregado al carrito');
      navigation.navigate('MainTabs', { screen: 'Carrito' });
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar al carrito');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={['top', 'bottom']}>
        <Text>Producto no encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageEmoji}>📦</Text>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatCurrency(product.priceCOP)}</Text>
          <Text style={styles.description}>{product.description || 'Sin descripción'}</Text>
          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Cantidad:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                <Ionicons name="remove" size={20} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(quantity + 1)}>
                <Ionicons name="add" size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
            <Text style={styles.addButtonText}>Agregar al carrito</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white },
  imageContainer: { alignItems: 'center', marginTop: 20 },
  imagePlaceholder: {
    width: '90%',
    height: 250,
    backgroundColor: COLORS.accentLight,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageEmoji: { fontSize: 80 },
  details: { padding: 16 },
  name: { fontSize: 22, fontWeight: '500', color: COLORS.text, marginBottom: 8 },
  price: { fontSize: 20, color: COLORS.accent, fontWeight: '500', marginBottom: 12 },
  description: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 20, lineHeight: 20 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  quantityLabel: { fontSize: 16, color: COLORS.text, marginRight: 16 },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: { fontSize: 18, fontWeight: '500', minWidth: 30, textAlign: 'center' },
  addButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '500' },
});