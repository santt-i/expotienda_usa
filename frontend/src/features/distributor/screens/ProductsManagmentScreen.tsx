import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Product } from '../../products/services/products.service';
import { distributorService } from '../services/distributor.service';
import ProductListItem from '../components/ProductListItem';
import { COLORS } from '../../../core/theme/colors';

export default function ProductsManagementScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // useFocusEffect se ejecuta cada vez que esta pantalla
  // vuelve a estar visible — al volver del formulario, al navegar hacia atrás, etc.
  // Es diferente a useEffect que solo corre una vez al montar
  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await distributorService.getMyProducts();
      setProducts(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Confirmar', '¿Eliminar producto permanentemente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await distributorService.deleteProduct(id);
            loadProducts();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <ProductListItem
      product={item}
      onEdit={() => navigation.navigate('ProductForm', { productId: item.id })}
      onDelete={() => handleDelete(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis productos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ProductForm')}
        >
          <Ionicons name="add-circle-outline" size={28} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tienes productos aún</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  title: { fontSize: 20, fontWeight: '500', color: COLORS.text },
  addButton: { padding: 4 },
  list: { padding: 16, paddingBottom: 20 },
  loader: { marginTop: 20 },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});