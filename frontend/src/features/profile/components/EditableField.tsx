import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../core/theme/colors';

type Props = {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
  editable?: boolean;
};

export default function EditableField({ label, value, onSave, editable = true }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    if (tempValue !== value) {
      onSave(tempValue);
    }
    setIsEditing(false);
  };

  if (!editable) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={tempValue}
            onChangeText={setTempValue}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={handleSave} style={styles.iconButton}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.accent} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.iconButton}>
            <Ionicons name="close-circle" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Ionicons name="pencil-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  iconButton: {
    padding: 4,
  },
});