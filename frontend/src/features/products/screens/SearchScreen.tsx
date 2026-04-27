import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { productsService, Product } from '../services/products.service';
import SearchBar from '../components/SearchBar';
import RecentSearches from '../components/RecentSearches';
import CategoryChips from '../components/CategoryChips';
import ProductSearchResult from '../components/ProductSearchResult';
import { COLORS } from '../../../core/theme/colors';

const STORAGE_KEY = '@recent_searches';

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Normalizar texto (quitar tildes, mayúsculas)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  useEffect(() => {
    productsService.getProducts()
      .then(setAllProducts)
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(data => {
      if (data) setRecentSearches(JSON.parse(data));
    });
  }, []);

  const saveRecentSearch = async (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const performSearch = useCallback((searchQuery: string, category: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!searchQuery.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const normalizedQuery = normalizeText(searchQuery);
      let filtered = allProducts.filter(p => 
        normalizeText(p.name).includes(normalizedQuery)
      );
      if (category !== 'all') {
        filtered = filtered.filter(p => normalizeText(p.name).includes(normalizeText(category)));
      }
      setResults(filtered);
      setLoading(false);
    }, 300);
  }, [allProducts]);

  useEffect(() => {
    performSearch(query, activeCategory);
  }, [query, activeCategory, performSearch]);

  const handleSearch = () => {
    if (query.trim()) {
      saveRecentSearch(query);
      performSearch(query, activeCategory);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
  };

  const handleRecentSelect = (term: string) => {
    setQuery(term);
    saveRecentSearch(term);
    performSearch(term, activeCategory);
  };

  const handleClearRecent = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const handleProductPress = (productId: number) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const renderContent = () => {
    if (loadingProducts) {
      return <ActivityIndicator size="large" color={COLORS.accent} style={styles.loader} />;
    }
    if (!query.trim()) {
      const featured = allProducts.slice(0, 5);
      return (
        <>
          <Text style={styles.sectionTitle}>Productos destacados</Text>
          {featured.map(product => (
            <ProductSearchResult key={product.id} product={product} onPress={handleProductPress} />
          ))}
        </>
      );
    }
    if (loading) {
      return <ActivityIndicator size="large" color={COLORS.accent} style={styles.loader} />;
    }
    if (results.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🔍😞</Text>
          <Text style={styles.emptyText}>No encontramos nada relacionado</Text>
          <Text style={styles.emptySubtext}>Intenta con otras palabras</Text>
        </View>
      );
    }
    return results.map(product => (
      <ProductSearchResult key={product.id} product={product} onPress={handleProductPress} />
    ));
  };

  return (
  <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
    <View style={styles.searchWrapper}>
      <SearchBar
        query={query}
        onChangeText={setQuery}
        onSearch={handleSearch}
        onClear={handleClear}
      />
    </View>
    <CategoryChips activeCategory={activeCategory} onSelect={setActiveCategory} />
    <RecentSearches
      searches={recentSearches}
      onSelect={handleRecentSelect}
      onClear={handleClearRecent}
    />
    <ScrollView contentContainerStyle={styles.list}>
      {renderContent()}
    </ScrollView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  loader: { marginTop: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '500', color: COLORS.text, marginVertical: 12 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: COLORS.text, marginBottom: 4 },
  emptySubtext: { fontSize: 12, color: COLORS.textSecondary },
});