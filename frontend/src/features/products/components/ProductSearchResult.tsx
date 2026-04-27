import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../services/products.service';
import { formatCurrency } from '../../../utils/formatters';
import { COLORS } from '../../../core/theme/colors';

type Props = {
  product: Product;
  onPress: (id: number) => void;
};

export default function ProductSearchResult({ product, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(product.id)} activeOpacity={0.8}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.emoji}>📦</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.price}>{formatCurrency(product.priceCOP)}</Text>
      </View>
      <View style={styles.stockBadge}>
        <Text style={styles.stockText}>{product.stock > 0 ? 'En stock' : 'Agotado'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: { fontSize: 30 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '500', color: COLORS.text, marginBottom: 4 },
  price: { fontSize: 14, color: COLORS.accent, fontWeight: '500' },
  stockBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: COLORS.accentLight },
  stockText: { fontSize: 10, color: COLORS.accent, fontWeight: '500' },
});