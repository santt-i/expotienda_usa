import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../core/theme/colors';

export type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
};

type Props = {
  items: MenuItem[];
};

export default function ProfileMenu({ items }: Props) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <TouchableOpacity key={index} style={styles.item} onPress={item.onPress}>
          <Ionicons name={item.icon} size={22} color={item.danger ? COLORS.error : COLORS.text} />
          <Text style={[styles.label, item.danger && styles.dangerLabel]}>{item.label}</Text>
          <Ionicons name="chevron-forward-outline" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginTop: 24,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  label: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: COLORS.text,
  },
  dangerLabel: {
    color: COLORS.error,
  },
});