import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { productsService, Product } from '../services/products.service';
import HomeHeader from '../components/HomeHeader';
import HomeBanner from '../components/HomeBanner';
import CategoryList from '../components/CategoryList';
import StoreList from '../components/StoreList';
import ProductGrid from '../components/ProductGrid';
import { COLORS } from '../../../core/theme/colors';

export default function HomeScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      productsService.getProducts()
        .then((data) => {
          setProducts(data);
          setFilteredProducts(data); // al inicio mostramos todos
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [])
  );

  // Cuando el usuario toca una categoría
  // categoryId = null significa "mostrar todos"
  const handleCategoryChange = (categoryId: number | null) => {
    if (!categoryId) {
      // Sin filtro — mostrar todos los productos
      setFilteredProducts(products);
      return;
    }
    // Filtrar solo los que tienen esa categoría
    const filtered = products.filter(p => p.categoryId === categoryId);
    setFilteredProducts(filtered);
  };

  const handleProductPress = (productId: number) => {
    navigation.navigate('ProductDetail', { productId });
  };

  if (loading) return null;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <HomeHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeBanner onExplore={() => navigation.navigate('Explorar')} />
        <CategoryList onCategoryChange={handleCategoryChange} />
        <StoreList />
        <ProductGrid
          products={filteredProducts}
          onProductPress={handleProductPress}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 24 },
});