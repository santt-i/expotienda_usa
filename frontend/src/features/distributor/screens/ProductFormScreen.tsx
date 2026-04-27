import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { distributorService } from '../services/distributor.service';
import { productsService } from '../../products/services/products.service';
import { categoriesService, Category } from '../../products/services/categories.service';
import { COLORS } from '../../../core/theme/colors';

export default function ProductFormScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const params = route.params as { productId?: number } | undefined;
  const productId = params?.productId;
  const isEditing = !!productId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeId, setStoreId] = useState<number | null>(null);

  // Lista de categorías que vienen del backend
  const [categories, setCategories] = useState<Category[]>([]);

  // Categoría seleccionada — null significa sin categoría
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    priceCOP: '',
    stock: '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Cargamos la tienda y las categorías al mismo tiempo
      // Promise.all hace las dos peticiones en paralelo — más rápido que hacerlas una por una
      const [store, cats] = await Promise.all([
        distributorService.getMyStore(),
        categoriesService.getAll(),
      ]);

      setStoreId(store.id);
      setCategories(cats);

      // Si estamos editando, cargamos los datos del producto
      if (productId) {
        const product = await productsService.getProductById(productId);
        setForm({
          name: product.name,
          description: product.description ?? '',
          priceCOP: product.priceCOP.toString(),
          stock: product.stock.toString(),
        });
        // Si el producto ya tenía categoría, la preseleccionamos
        setSelectedCategoryId(product.categoryId ?? null);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return false;
    }
    if (!form.priceCOP || isNaN(Number(form.priceCOP)) || Number(form.priceCOP) <= 0) {
      Alert.alert('Error', 'El precio debe ser un número mayor a 0');
      return false;
    }
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      Alert.alert('Error', 'El stock debe ser un número válido');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (!storeId) {
      Alert.alert('Error', 'No se encontró tu tienda');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        priceCOP: Number(form.priceCOP),
        stock: Number(form.stock),
        storeId,
        // Solo incluimos categoryId si el distribuidor eligió una
        // undefined hace que Prisma no toque ese campo
        ...(selectedCategoryId && { categoryId: selectedCategoryId }),
      };

      if (isEditing && productId) {
        await distributorService.updateProduct(productId, payload);
        Alert.alert('Éxito', 'Producto actualizado');
      } else {
        await distributorService.createProduct(payload);
        Alert.alert('Éxito', 'Producto creado');
      }

      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing ? 'Editar producto' : 'Nuevo producto'}
        </Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator size="small" color={COLORS.white} />
            : <Text style={styles.saveButtonText}>Guardar</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Nombre del producto *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Café especial 500g"
          placeholderTextColor={COLORS.textSecondary}
          value={form.name}
          onChangeText={(v) => handleChange('name', v)}
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe tu producto..."
          placeholderTextColor={COLORS.textSecondary}
          value={form.description}
          onChangeText={(v) => handleChange('description', v)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Selector de categoría */}
        <Text style={styles.label}>Categoría</Text>
        <Text style={styles.labelHint}>
          Toca una para seleccionarla. Toca de nuevo para deseleccionar.
        </Text>
        <View style={styles.categoriesGrid}>
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => setSelectedCategoryId(isSelected ? null : cat.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[
                  styles.categoryLabel,
                  isSelected && styles.categoryLabelActive,
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.row}>
          <View style={styles.rowField}>
            <Text style={styles.label}>Precio (COP) *</Text>
            <View style={styles.prefixInput}>
              <Text style={styles.prefix}>$</Text>
              <TextInput
                style={styles.inputInline}
                placeholder="0"
                placeholderTextColor={COLORS.textSecondary}
                value={form.priceCOP}
                onChangeText={(v) => handleChange('priceCOP', v)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.rowField}>
            <Text style={styles.label}>Stock *</Text>
            <View style={styles.stockRow}>
              <TouchableOpacity
                style={styles.stockBtn}
                onPress={() => {
                  const current = Number(form.stock) || 0;
                  if (current > 0) handleChange('stock', (current - 1).toString());
                }}
              >
                <Ionicons name="remove" size={18} color={COLORS.text} />
              </TouchableOpacity>
              <TextInput
                style={styles.stockInput}
                value={form.stock}
                onChangeText={(v) => handleChange('stock', v)}
                keyboardType="numeric"
                textAlign="center"
              />
              <TouchableOpacity
                style={styles.stockBtn}
                onPress={() => {
                  const current = Number(form.stock) || 0;
                  handleChange('stock', (current + 1).toString());
                }}
              >
                <Ionicons name="add" size={18} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.storeIndicator}>
          <Ionicons name="storefront-outline" size={16} color={COLORS.accent} />
          <Text style={styles.storeText}>
            Se guardará en tu tienda (ID: {storeId})
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  backButton: { padding: 4 },
  title: { fontSize: 16, fontWeight: '500', color: COLORS.text },
  saveButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  saveButtonText: { color: COLORS.white, fontSize: 14, fontWeight: '500' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: 16,
  },
  labelHint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 10,
    marginTop: -4,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  textArea: { height: 100 },

  // Grid de categorías — 3 columnas
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 36,
  },
  categoryChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  categoryIcon: { fontSize: 14 },
  categoryLabel: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: COLORS.white,
  },

  row: { flexDirection: 'row', gap: 12 },
  rowField: { flex: 1 },
  prefixInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  prefix: { fontSize: 15, color: COLORS.textSecondary, marginRight: 4 },
  inputInline: { flex: 1, paddingVertical: 12, fontSize: 15, color: COLORS.text },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    overflow: 'hidden',
  },
  stockBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 12,
  },
  storeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
    padding: 12,
    backgroundColor: COLORS.accentLight,
    borderRadius: 10,
  },
  storeText: { fontSize: 13, color: COLORS.accent },
});