import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../core/theme/colors';

type Props = {
  searches: string[];
  onSelect: (term: string) => void;
  onClear: () => void;
};

export default function RecentSearches({ searches, onSelect, onClear }: Props) {
  if (searches.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Búsquedas recientes</Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clearText}>Borrar todo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
        {searches.map((term, index) => (
          <TouchableOpacity key={index} style={styles.chip} onPress={() => onSelect(term)}>
            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.chipText}>{term}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8 },
  title: { fontSize: 14, fontWeight: '500', color: COLORS.text },
  clearText: { fontSize: 12, color: COLORS.accent },
  chipsContainer: { paddingHorizontal: 16, gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.lightGray, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  chipText: { fontSize: 12, color: COLORS.text },
});