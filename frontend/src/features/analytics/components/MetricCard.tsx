import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../core/theme/colors';
import { formatCurrency } from '../../../utils/formatters';

type Props = {
  title: string;
  value: number;
  prefix?: string; // opcional: '$' para mostrar como moneda
};

export default function MetricCard({ title, value, prefix }: Props) {
  let displayValue: string;
  if (prefix === '$') {
    displayValue = formatCurrency(value);
  } else {
    displayValue = value.toString();
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{displayValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 4,
    flex: 1,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.accent,
    marginTop: 4,
  },
});