import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../core/theme/colors';

const CATEGORIES = [
  { id: 'all',        label: 'Todo',       icon: 'apps-outline' },
  { id: 'cafe',       label: 'Café',       icon: 'cafe-outline' },
  { id: 'artesania',  label: 'Artesanías', icon: 'brush-outline' },
  { id: 'ropa',       label: 'Ropa',       icon: 'shirt-outline' },
  { id: 'hogar',      label: 'Hogar',      icon: 'home-outline' },
  { id: 'gastronomia',label: 'Gastronomía',icon: 'restaurant-outline' },
];

type Props = {
  activeCategory: string;
  onSelect: (categoryId: string) => void;
};

export default function CategoryChips({ activeCategory, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map(cat => {
        const isActive = activeCategory === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={cat.icon as any}
              size={14}
              color={isActive ? COLORS.white : COLORS.text}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 4,
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    // Borde siempre del mismo grosor — esto evita el salto de tamaño
    borderWidth: 1,
    borderColor: COLORS.border,
    // Altura fija para que nunca cambie
    height: 34,
  },
  chipActive: {
    backgroundColor: COLORS.accent,
    // Mismo borderWidth, solo cambia el color
    borderColor: COLORS.accent,
  },
  label: {
    fontSize: 12,
    color: COLORS.text,
    // fontWeight fijo — si cambia entre 400 y 500 el texto se ensancha
    fontWeight: '500',
  },
  labelActive: {
    color: COLORS.white,
  },
});