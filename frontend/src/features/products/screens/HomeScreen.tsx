import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { productsService, Product } from '../services/products.service';
import HomeHeader from '../components/HomeHeader';
import HomeBanner from '../components/HomeBanner';
import CategoryList from '../components/CategoryList';
import StoreList from '../components/StoreList';
import ProductGrid from '../components/ProductGrid';
import { COLORS } from '../../../core/theme/colors';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      productsService.getProducts()
        .then((data) => {
          setAllProducts(data);
          applyFilters(data, activeCategoryId, searchQuery);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [])
  );

  // Aplica ambos filtros (categoría y búsqueda)
  const applyFilters = (products: Product[], categoryId: number | null, query: string) => {
    let filtered = products;
    if (categoryId !== null) {
      filtered = filtered.filter(p => p.categoryId === categoryId);
    }
    if (query.trim()) {
      const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(p =>
        p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalizedQuery)
      );
    }
    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setActiveCategoryId(categoryId);
    applyFilters(allProducts, categoryId, searchQuery);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    applyFilters(allProducts, activeCategoryId, text);
  };

  const handleProductPress = (productId: number) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleCartPress = () => {
    navigation.navigate('MainTabs', { screen: 'Carrito' });
  };
  const handleAvatarPress = () => {
    navigation.navigate('Perfil');
  };
  const handleNotificationsPress = () => {
    alert('Próximamente: notificaciones');
  };

  // 🔍 Si hay texto en la búsqueda, ocultamos banner y categorías
  const isSearching = searchQuery.trim().length > 0;

  if (loading) return null;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <HomeHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCartPress={handleCartPress}
        onAvatarPress={handleAvatarPress}
        onNotificationsPress={handleNotificationsPress}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {!isSearching && (
          <>
            <HomeBanner onExplore={() => navigation.navigate('Explorar')} />
            <CategoryList onCategoryChange={handleCategoryChange} />
          </>
        )}
        <StoreList />
        <ProductGrid products={filteredProducts} onProductPress={handleProductPress} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 24 },
});