import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../core/context/AuthContext';
import { profileService, UserProfile } from '../services/profile.service';
import Avatar from '../components/Avatar';
import EditableField from '../components/EditableField';
import ProfileMenu, { MenuItem } from '../components/ProfileMenu';
import { COLORS } from '../../../core/theme/colors';

export default function ProfileScreen({ navigation }: any) {
  const { user: authUser, signOut } = useAuth(); // usuario del contexto
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isDistributor = authUser?.role === 'DISTRIBUIDOR';

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setUser(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (field: keyof UserProfile, value: string) => {
    if (!user) return;
    try {
      const updated = await profileService.updateProfile({ [field]: value });
      setUser(updated);
      Alert.alert('Éxito', 'Perfil actualizado');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el campo');
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: 'list-outline' as const,
      label: 'Mis órdenes',
      onPress: () => navigation.navigate('MainTabs', { screen: 'Órdenes' }),
    },
    {
      icon: 'location-outline' as const,
      label: 'Mis direcciones',
      onPress: () => console.log('Navegar a direcciones'),
    },
    {
      icon: 'card-outline' as const,
      label: 'Métodos de pago',
      onPress: () => console.log('Navegar a pagos'),
    },
    ...(isDistributor ? [{
      icon: 'bar-chart-outline' as const,
      label: 'Panel de control',
      onPress: () => navigation.navigate('Dashboard'),
    }] : []),
    {
      icon: 'log-out-outline',
      label: 'Cerrar sesión',
      onPress: signOut,
      danger: true,
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No se pudo cargar el perfil</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Avatar name={user.name} size={100} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.fields}>
          <EditableField
            label="Nombre"
            value={user.name}
            onSave={(val: string) => handleUpdate('name', val)}
          />
          <EditableField
            label="Email"
            value={user.email}
            onSave={(val: string) => handleUpdate('email', val)}
          />
          <EditableField
            label="País"
            value={user.country}
            onSave={(val: string) => handleUpdate('country', val)}
          />
        </View>

        <ProfileMenu items={menuItems} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  name: {
    fontSize: 22,
    fontWeight: '500',
    color: COLORS.text,
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  fields: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
});
