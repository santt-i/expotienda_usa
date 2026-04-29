import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { adminService, Stats, User, Store } from '../services/admin.service';
import { COLORS } from '../../../core/theme/colors';

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, storesData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(20),
        adminService.getStores(20),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setStores(storesData);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'CLIENTE' : 'ADMIN';
    Alert.alert(
      'Cambiar rol',
      `¿Estás seguro de cambiar el rol a ${newRole}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              await adminService.updateUserRole(userId, newRole);
              setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
              Alert.alert('Éxito', 'Rol actualizado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo actualizar el rol');
            }
          },
        },
      ]
    );
  };

  const handleDeleteStore = async (storeId: number, storeName: string) => {
    Alert.alert(
      'Eliminar tienda',
      `¿Eliminar la tienda "${storeName}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.deleteStore(storeId);
              setStores(prev => prev.filter(s => s.id !== storeId));
              Alert.alert('Éxito', 'Tienda eliminada');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la tienda');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Panel de administración</Text>

        {/* Tarjetas de estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={28} color={COLORS.accent} />
            <Text style={styles.statValue}>{stats?.totalUsers}</Text>
            <Text style={styles.statLabel}>Usuarios</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="storefront-outline" size={28} color={COLORS.accent} />
            <Text style={styles.statValue}>{stats?.totalStores}</Text>
            <Text style={styles.statLabel}>Tiendas</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cube-outline" size={28} color={COLORS.accent} />
            <Text style={styles.statValue}>{stats?.totalProducts}</Text>
            <Text style={styles.statLabel}>Productos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cart-outline" size={28} color={COLORS.accent} />
            <Text style={styles.statValue}>{stats?.totalOrders}</Text>
            <Text style={styles.statLabel}>Órdenes</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={28} color={COLORS.accent} />
            <Text style={styles.statValue}>${stats?.totalSales.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Ventas totales</Text>
          </View>
        </View>

        {/* Lista de usuarios */}
        <Text style={styles.sectionTitle}>Usuarios</Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.listItemInfo}>
                <Text style={styles.listItemTitle}>{item.name}</Text>
                <Text style={styles.listItemSubtitle}>{item.email}</Text>
                <Text style={styles.listItemSubtitle}>Rol: {item.role}</Text>
              </View>
              <TouchableOpacity
                style={styles.roleButton}
                onPress={() => handleRoleChange(item.id, item.role)}
              >
                <Text style={styles.roleButtonText}>
                  {item.role === 'ADMIN' ? 'Quitar admin' : 'Hacer admin'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />

        {/* Lista de tiendas */}
        <Text style={styles.sectionTitle}>Tiendas</Text>
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.listItemInfo}>
                <Text style={styles.listItemTitle}>{item.name}</Text>
                <Text style={styles.listItemSubtitle}>Dueño: {item.owner.name}</Text>
                <Text style={styles.listItemSubtitle}>Email: {item.owner.email}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteStore(item.id, item.name)}
              >
                <Ionicons name="trash-outline" size={20} color={COLORS.white} />
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 30 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: COLORS.text },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  statValue: { fontSize: 22, fontWeight: 'bold', color: COLORS.accent, marginTop: 4 },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 12, color: COLORS.text },
  listContent: { paddingBottom: 12 },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  listItemInfo: { flex: 1 },
  listItemTitle: { fontSize: 14, fontWeight: '500', color: COLORS.text },
  listItemSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  roleButton: { backgroundColor: COLORS.accent, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginLeft: 8 },
  roleButtonText: { color: COLORS.white, fontSize: 12, fontWeight: '500' },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  deleteButtonText: { color: COLORS.white, fontSize: 12, fontWeight: '500', marginLeft: 4 },
});