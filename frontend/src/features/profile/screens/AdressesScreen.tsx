import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, Modal,
  TextInput, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addressesService, Address } from '../services/addresses.serivce';
import { COLORS } from '../../../core/theme/colors';

export default function AddressesScreen({ navigation }: any) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    country: 'Colombia',
    zipCode: '',
  });

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [])
  );

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await addressesService.getAll();
      setAddresses(data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar las direcciones');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ label: '', street: '', city: '', state: '', country: 'Colombia', zipCode: '' });
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEdit = (address: Address) => {
    setForm({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode ?? '',
    });
    setEditingId(address.id);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.label || !form.street || !form.city || !form.state) {
      Alert.alert('Error', 'Label, calle, ciudad y departamento son obligatorios');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await addressesService.update(editingId, form);
      } else {
        await addressesService.create(form);
      }
      setModalVisible(false);
      resetForm();
      loadAddresses();
    } catch {
      Alert.alert('Error', 'No se pudo guardar la dirección');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Eliminar', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await addressesService.remove(id);
            loadAddresses();
          } catch {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        },
      },
    ]);
  };

  const handleSetDefault = async (id: number) => {
    try {
      await addressesService.setDefault(id);
      loadAddresses();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar');
    }
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.labelRow}>
          <Ionicons name="location" size={16} color={COLORS.accent} />
          <Text style={styles.label}>{item.label}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Predeterminada</Text>
            </View>
          )}
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
            <Ionicons name="pencil-outline" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.street}>{item.street}</Text>
      <Text style={styles.city}>{item.city}, {item.state}</Text>
      <Text style={styles.country}>{item.country}</Text>

      {!item.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultBtn}
          onPress={() => handleSetDefault(item.id)}
        >
          <Text style={styles.setDefaultText}>Marcar como predeterminada</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Mis direcciones</Text>
        <TouchableOpacity onPress={openCreate}>
          <Ionicons name="add-circle-outline" size={28} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} style={styles.loader} />
      ) : (
        <FlatList
          data={addresses}
          renderItem={renderAddress}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="location-outline" size={48} color={COLORS.border} />
              <Text style={styles.emptyText}>No tienes direcciones guardadas</Text>
              <TouchableOpacity style={styles.addButton} onPress={openCreate}>
                <Text style={styles.addButtonText}>Agregar dirección</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Modal para crear/editar */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal} edges={['top', 'bottom']}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingId ? 'Editar dirección' : 'Nueva dirección'}
            </Text>
            <TouchableOpacity onPress={handleSave} disabled={saving}>
              {saving
                ? <ActivityIndicator size="small" color={COLORS.accent} />
                : <Text style={styles.saveText}>Guardar</Text>}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            {[
              { key: 'label', placeholder: 'Ej: Casa, Oficina', label: 'Etiqueta *' },
              { key: 'street', placeholder: 'Calle 123 # 45-67', label: 'Dirección *' },
              { key: 'city', placeholder: 'Bogotá', label: 'Ciudad *' },
              { key: 'state', placeholder: 'Cundinamarca', label: 'Departamento *' },
              { key: 'country', placeholder: 'Colombia', label: 'País' },
              { key: 'zipCode', placeholder: '110111', label: 'Código postal' },
            ].map((field) => (
              <View key={field.key}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor={COLORS.textSecondary}
                  value={form[field.key as keyof typeof form]}
                  onChangeText={(v) => setForm(prev => ({ ...prev, [field.key]: v }))}
                />
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: COLORS.white, borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  title: { fontSize: 16, fontWeight: '500', color: COLORS.text },
  loader: { marginTop: 40 },
  list: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 14,
    padding: 16, marginBottom: 12, borderWidth: 0.5, borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontSize: 15, fontWeight: '500', color: COLORS.text },
  defaultBadge: {
    backgroundColor: COLORS.accentLight, paddingHorizontal: 8,
    paddingVertical: 2, borderRadius: 20,
  },
  defaultText: { fontSize: 10, color: COLORS.accent, fontWeight: '500' },
  cardActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 4 },
  street: { fontSize: 14, color: COLORS.text, marginBottom: 2 },
  city: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 2 },
  country: { fontSize: 13, color: COLORS.textSecondary },
  setDefaultBtn: { marginTop: 10 },
  setDefaultText: { fontSize: 12, color: COLORS.accent, fontWeight: '500' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: COLORS.textSecondary },
  addButton: {
    backgroundColor: COLORS.accent, paddingHorizontal: 24,
    paddingVertical: 12, borderRadius: 10, marginTop: 8,
  },
  addButtonText: { color: COLORS.white, fontSize: 15, fontWeight: '500' },
  modal: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16, backgroundColor: COLORS.white,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: 16, fontWeight: '500', color: COLORS.text },
  cancelText: { fontSize: 15, color: COLORS.textSecondary },
  saveText: { fontSize: 15, color: COLORS.accent, fontWeight: '500' },
  modalContent: { padding: 16, paddingBottom: 40 },
  fieldLabel: {
    fontSize: 13, fontWeight: '500', color: COLORS.textSecondary,
    marginBottom: 6, marginTop: 14,
  },
  input: {
    backgroundColor: COLORS.white, borderWidth: 0.5, borderColor: COLORS.border,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12,
    fontSize: 15, color: COLORS.text,
  },
});