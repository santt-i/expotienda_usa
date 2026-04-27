import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../../../core/theme/colors';
import { Product } from '../services/products.service';
import ProductCard from './ProductCard';

type Props = {
  products: Product[];
  onProductPress: (id: number) => void;
};

export default function ProductGrid({ products, onProductPress }: Props) {
  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay productos disponibles</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} onPress={onProductPress} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      scrollEnabled={false}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  row: { justifyContent: 'space-between', paddingHorizontal: 16 },
  list: { paddingBottom: 20 },
  emptyContainer: { paddingHorizontal: 16, marginTop: 20 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
});