import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../core/theme/colors';

type Props = {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

export default function MetricCard({ title, value, icon, color }: Props) {
  return (
    <View style={styles.card}>
      <Ionicons name={icon} size={28} color={color} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  value: { fontSize: 24, fontWeight: '500', color: COLORS.text, marginVertical: 8 },
  title: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'center' },
});