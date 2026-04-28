import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
  Image, FlatList, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { productsService, Product } from '../services/products.service';
import { cartService } from '../../cart/services/cart.service';
import { COLORS } from '../../../core/theme/colors';
import { formatCurrency } from '../../../utils/formatters';

// Ancho de la pantalla para calcular el tamaño de la imagen
const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { productId } = route.params as { productId: number };
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Índice de la imagen activa en la galería
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    productsService.getProductById(productId)
      .then(setProduct)
      .catch(() => Alert.alert('Error', 'No se pudo cargar el producto'))
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

  const hasImages = product.images && product.images.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Sección de imágenes */}
        {hasImages ? (
          <View>
            {/* FlatList horizontal para deslizar entre imágenes */}
            {/* pagingEnabled hace que cada deslizamiento muestre exactamente una imagen */}
            <FlatList
              data={product.images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              onMomentumScrollEnd={(e) => {
                // Calculamos qué imagen está visible según el scroll
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setActiveImageIndex(index);
              }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
            />

            {/* Puntos indicadores — solo si hay más de una imagen */}
            {product.images.length > 1 && (
              <View style={styles.dotsContainer}>
                {product.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === activeImageIndex && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          // Sin imágenes — placeholder grande
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageEmoji}>📦</Text>
          </View>
        )}

        {/* Botón volver — flotante sobre la imagen */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>

        {/* Detalles del producto */}
        <View style={styles.details}>
          {/* Categoría si tiene */}
          {product.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryIcon}>{product.category.icon}</Text>
              <Text style={styles.categoryName}>{product.category.name}</Text>
            </View>
          )}

          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatCurrency(product.priceCOP)}</Text>
          <Text style={styles.description}>
            {product.description || 'Sin descripción'}
          </Text>

          {/* Selector de cantidad */}
          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Cantidad:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
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
  centerContainer: {
    flex: 1, justifyContent: 'center',
    alignItems: 'center', backgroundColor: COLORS.white,
  },
  image: {
    width,
    height: 280,
  },
  imagePlaceholder: {
    width: '100%',
    height: 280,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageEmoji: { fontSize: 80 },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.accent,
    width: 16, // el punto activo es más ancho
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  details: { padding: 16 },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  categoryIcon: { fontSize: 14 },
  categoryName: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '500',
  },
  name: { fontSize: 22, fontWeight: '500', color: COLORS.text, marginBottom: 8 },
  price: { fontSize: 20, color: COLORS.accent, fontWeight: '500', marginBottom: 12 },
  description: {
    fontSize: 14, color: COLORS.textSecondary,
    marginBottom: 20, lineHeight: 20,
  },
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  quantityLabel: { fontSize: 16, color: COLORS.text, marginRight: 16 },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  quantityButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center', justifyContent: 'center',
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