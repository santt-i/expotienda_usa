// src/features/products/screens/HomeScreen.tsx
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
import { notificationsService } from '../../notifications/services/notifications-service';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      // Cargar productos
      productsService.getProducts()
        .then((data) => {
          setAllProducts(data);
          applyFilters(data, activeCategoryId, searchQuery);
        })
        .catch(console.error)
        .finally(() => setLoading(false));

      // Cargar contador de notificaciones no leídas
      notificationsService.getUnreadCount()
        .then(setUnreadCount)
        .catch(console.error);
    }, [])
  );

  // Aplica ambos filtros (categoría y búsqueda por texto)
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

  // Cambio de categoría desde CategoryList
  const handleCategoryChange = (categoryId: number | null) => {
    setActiveCategoryId(categoryId);
    applyFilters(allProducts, categoryId, searchQuery);
  };

  // Cambio en la barra de búsqueda (desde HomeHeader)
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    applyFilters(allProducts, activeCategoryId, text);
  };

  // Navegación al detalle de producto
  const handleProductPress = (productId: number) => {
    navigation.navigate('ProductDetail', { productId });
  };

  // Acciones de los botones del header
  const handleCartPress = () => {
    navigation.navigate('MainTabs', { screen: 'Carrito' });
  };

  const handleAvatarPress = () => {
    navigation.navigate('Perfil');
  };

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications');
  };

  if (loading) return null;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <HomeHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCartPress={handleCartPress}
        onAvatarPress={handleAvatarPress}
        onNotificationsPress={handleNotificationsPress}
        unreadCount={unreadCount}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <HomeBanner onExplore={() => navigation.navigate('Explorar')} />
        <CategoryList onCategoryChange={handleCategoryChange} />
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