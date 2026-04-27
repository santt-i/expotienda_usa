import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../core/theme/colors';

type Props = {
  query: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  onClear: () => void;
};

export default function SearchBar({ query, onChangeText, onSearch, onClear }: Props) {
  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.input}
        placeholder="Buscar productos..."
        value={query}
        onChangeText={onChangeText}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onSearch}>
        <Ionicons name="search-outline" size={24} color={COLORS.accent} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 16 },
  clearButton: { padding: 4, marginRight: 8 },
});