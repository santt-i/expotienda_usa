import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../core/theme/colors';

type Props = {
  name: string;
  size?: number;
};

export default function Avatar({ name, size = 80 }: Props) {
  const initial = name?.charAt(0).toUpperCase() || '?';
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  initial: {
    color: COLORS.accent,
    fontWeight: '500',
  },
});