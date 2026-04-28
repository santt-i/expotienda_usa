import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Image,
} from 'react-native';
import { COLORS } from '../../../core/theme/colors';
import { Product } from '../services/products.service';
import { formatCurrency } from '../../../utils/formatters';

type Props = {
  product: Product;
  onPress: (productId: number) => void;
};

export default function ProductCard({ product, onPress }: Props) {
  const firstImage = product.images?.[0];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product.id)}
      activeOpacity={0.8}
    >
      {/* Área de imagen — condicional según si tiene foto o no */}
      {firstImage ? (
        // Tiene imagen — la mostramos con Image 
        // resizeMode="cover" hace que la imagen llene el espacio sin distorsionarse
        <Image
          source={{ uri: firstImage }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        // No tiene imagen — mostramos el placeholder con emoji
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageEmoji}>📦</Text>
        </View>
      )}

      <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
      <Text style={styles.price}>{formatCurrency(product.priceCOP)}</Text>

      {product.stock > 0 ? (
        <View style={styles.stockBadge}>
          <Text style={styles.stockText}>En stock</Text>
        </View>
      ) : (
        <View style={[styles.stockBadge, styles.outOfStock]}>
          <Text style={[styles.stockText, styles.outOfStockText]}>Agotado</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.accentLight,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  imageEmoji: { fontSize: 40 },
  name: { fontSize: 13, fontWeight: '500', color: COLORS.text, marginBottom: 4 },
  price: { fontSize: 14, color: COLORS.accent, fontWeight: '500', marginBottom: 6 },
  stockBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: COLORS.accentLight,
  },
  stockText: { fontSize: 10, color: COLORS.accent, fontWeight: '500' },
  outOfStock: { backgroundColor: COLORS.error },
  outOfStockText: { color: COLORS.white },
});