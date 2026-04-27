import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../../core/theme/colors';
import { categoriesService, Category } from '../services/categories.service';

interface Props {
  onCategoryChange?: (categoryId: number | null) => void;
}

export default function CategoryList({ onCategoryChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesService.getAll()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePress = (categoryId: number) => {
    const newId = activeId === categoryId ? null : categoryId;
    setActiveId(newId);

    onCategoryChange?.(newId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.catItem}
              onPress={() => handlePress(cat.id)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.catIcon,
                isActive ? styles.catIconActive : styles.catIconInactive,
              ]}>
                <Text style={styles.catEmoji}>{cat.icon}</Text>
              </View>
              <Text style={[
                styles.catLabel,
                isActive && styles.catLabelActive,
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 20 },
  loadingContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '500', color: COLORS.text },
  seeAll: { fontSize: 12, color: COLORS.accent, fontWeight: '500' },
  scrollContent: { paddingHorizontal: 16, gap: 10 },
  catItem: { alignItems: 'center', gap: 6 },
  catIcon: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catIconActive: { backgroundColor: COLORS.accent },
  catIconInactive: {
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  catEmoji: { fontSize: 22 },
  catLabel: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center' },
  catLabelActive: { color: COLORS.accent, fontWeight: '500' },
});