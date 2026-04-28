import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../core/theme/colors';
import { formatCurrency } from '../../../utils/formatters';

type Props = {
  currentMonth: number;
  lastMonth: number;
  percentageChange: number;
};

export default function ComparisonCard({ currentMonth, lastMonth, percentageChange }: Props) {
  const isPositive = percentageChange >= 0;
  const arrow = isPositive ? 'arrow-up' : 'arrow-down';
  const arrowColor = isPositive ? COLORS.success : COLORS.error;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Comparación mensual</Text>
      <View style={styles.row}>
        <View style={styles.monthItem}>
          <Text style={styles.monthLabel}>Mes actual</Text>
          <Text style={styles.monthValue}>{formatCurrency(currentMonth)}</Text>
        </View>
        <View style={styles.monthItem}>
          <Text style={styles.monthLabel}>Mes anterior</Text>
          <Text style={styles.monthValue}>{formatCurrency(lastMonth)}</Text>
        </View>
      </View>
      <View style={styles.changeContainer}>
        <Ionicons name={arrow} size={20} color={arrowColor} />
        <Text style={[styles.changeText, { color: arrowColor }]}>
          {Math.abs(percentageChange)}% {isPositive ? 'más' : 'menos'} que el mes anterior
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  title: { fontSize: 16, fontWeight: '500', color: COLORS.text, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  monthItem: { alignItems: 'center', flex: 1 },
  monthLabel: { fontSize: 12, color: COLORS.textSecondary },
  monthValue: { fontSize: 18, fontWeight: '500', color: COLORS.text, marginTop: 4 },
  changeContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  changeText: { fontSize: 12 },
});