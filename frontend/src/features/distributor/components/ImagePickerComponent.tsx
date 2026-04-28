import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { uploadsService } from '../../../core/api/uploads.service';
import { COLORS } from '../../../core/theme/colors';

interface Props {
  productId: number;          
  existingImages?: string[];  // imágenes que ya tiene el producto al editar
  onImagesChange?: (images: string[]) => void; 
}

export default function ImagePickerComponent({
  productId,
  existingImages = [],
  onImagesChange,
}: Props) {
  // Combinamos las imágenes existentes con las que vaya subiendo
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);

  // Pedir permiso al sistema operativo para acceder a la galería
  // Sin esto la app no puede ver las fotos del celular
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso necesario',
        'Necesitamos acceso a tu galería para subir fotos',
      );
      return false;
    }
    return true;
  };

  const handlePickImage = async () => {
    // Máximo 5 imágenes por producto
    if (images.length >= 5) {
      Alert.alert('Límite alcanzado', 'Máximo 5 imágenes por producto');
      return;
    }

    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    // Abrimos la galería del celular
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,   // permite recortar la imagen
      aspect: [1, 1],        // forzamos cuadrado — más consistente en el grid
      quality: 0.8,          // 80% de calidad — buen balance tamaño/calidad
    });

    // El usuario canceló sin elegir imagen
    if (result.canceled) return;

    const imageUri = result.assets[0].uri;
    setUploading(true);

    try {
      // Llamamos al servicio que hace los 3 pasos internamente
      const imageUrl = await uploadsService.uploadProductImage(productId, imageUri);

      // Agregamos la nueva URL al estado local
      const newImages = [...images, imageUrl];
      setImages(newImages);

      // Notificamos al padre — por ejemplo para actualizar el formulario
      onImagesChange?.(newImages);
    } catch (error) {
      Alert.alert('Error', 'No se pudo subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Fotos del producto{' '}
        <Text style={styles.counter}>{images.length}/5</Text>
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imagesRow}
      >
        {/* Imágenes ya subidas */}
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            {/* Badge "Principal" en la primera imagen */}
            {index === 0 && (
              <View style={styles.mainBadge}>
                <Text style={styles.mainBadgeText}>Principal</Text>
              </View>
            )}
          </View>
        ))}

        {/* Botón para agregar más — solo si hay menos de 5 */}
        {images.length < 5 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handlePickImage}
            disabled={uploading}
          >
            {uploading ? (
              // Mientras sube mostramos un spinner
              <ActivityIndicator color={COLORS.accent} />
            ) : (
              <>
                <Ionicons
                  name="camera-outline"
                  size={28}
                  color={COLORS.accent}
                />
                <Text style={styles.addText}>Agregar foto</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>

      <Text style={styles.hint}>
        La primera foto es la imagen principal del producto
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  counter: {
    color: COLORS.accent,
  },
  imagesRow: {
    gap: 10,
    paddingVertical: 4,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  mainBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  mainBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '500',
  },
  addButton: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addText: {
    fontSize: 10,
    color: COLORS.accent,
    fontWeight: '500',
  },
  hint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
});