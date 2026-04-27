import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { distributorService } from '../services/distributor.service';
import { COLORS } from '../../../core/theme/colors';

interface Props {
  onStoreCreated: (store: { id: number; name: string }) => void;
}

export default function CreateStoreForm({ onStoreCreated }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre de la tienda es obligatorio');
      return;
    }

    setSaving(true);
    try {
      const store = await distributorService.createStore({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      onStoreCreated(store);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'No se pudo crear la tienda';
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="storefront-outline" size={40} color={COLORS.accent} />
      </View>

      <Text style={styles.title}>Crea tu tienda</Text>
      <Text style={styles.subtitle}>
        Antes de vender necesitas configurar tu tienda. Solo toma un minuto.
      </Text>

      <Text style={styles.label}>Nombre de la tienda *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Café Origen Colombia"
        placeholderTextColor={COLORS.textSecondary}
        value={name}
        onChangeText={setName}
        maxLength={50}
      />

      <Text style={styles.label}>
        Descripción <Text style={styles.optional}>(opcional)</Text>
      </Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Cuéntale a tus clientes de qué trata tu tienda..."
        placeholderTextColor={COLORS.textSecondary}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        maxLength={200}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreate}
        disabled={saving}
      >
        {saving
          ? <ActivityIndicator color={COLORS.white} />
          : <Text style={styles.buttonText}>Crear mi tienda</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    alignSelf: 'flex-start',
    marginBottom: 6,
    marginTop: 4,
  },
  optional: {
    fontWeight: '400',
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 16,
  },
  textArea: {
    height: 90,
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
});