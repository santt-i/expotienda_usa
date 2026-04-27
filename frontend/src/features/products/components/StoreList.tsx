import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../../core/theme/colors';
import { productsService, Store } from '../services/products.service';

export default function StoreList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsService.getStores()
      .then(setStores)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tiendas verificadas</Text>
        <Text style={styles.loadingText}>Cargando tiendas...</Text>
      </View>
    );
  }

  if (stores.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tiendas verificadas</Text>
        <Text style={styles.emptyText}>No hay tiendas disponibles</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tiendas verificadas</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {stores.map(store => (
          <TouchableOpacity key={store.id} style={styles.storeCard}>
            <View style={styles.storeAvatar}>
              <Text style={styles.storeInitial}>{store.name.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.storeName} numberOfLines={1}>{store.name}</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verificada</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  storeCard: {
    width: 110,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  storeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  storeInitial: {
    fontSize: 24,
    color: COLORS.accent,
    fontWeight: '500',
  },
  storeName: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  verifiedBadge: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 9,
    color: COLORS.accent,
    fontWeight: '500',
  },
  loadingText: {
    paddingHorizontal: 16,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  emptyText: {
    paddingHorizontal: 16,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});