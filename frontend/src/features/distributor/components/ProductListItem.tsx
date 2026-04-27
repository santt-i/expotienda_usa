import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../products/services/products.service';
import { formatCurrency } from '../../../utils/formatters';
import { COLORS } from '../../../core/theme/colors';

type Props = {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProductListItem({ product, onEdit, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatCurrency(product.priceCOP)}</Text>
        <Text style={styles.stock}>Stock: {product.stock}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
          <Ionicons name="pencil-outline" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
          <Ionicons name="trash-outline" size={22} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '500', color: COLORS.text, marginBottom: 4 },
  price: { fontSize: 14, color: COLORS.accent, marginBottom: 2 },
  stock: { fontSize: 12, color: COLORS.textSecondary },
  actions: { flexDirection: 'row', gap: 16 },
  iconButton: { padding: 4 },
});