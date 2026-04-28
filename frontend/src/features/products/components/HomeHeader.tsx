import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../core/theme/colors';
import { useAuth } from '../../../core/context/AuthContext';

const Logo = require('../../../../assets/images/logo_expotienda.png');
const LOGO_WIDTH = 130;
const LOGO_HEIGHT = 71;

type Props = {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onCartPress: () => void;
  onAvatarPress: () => void;
  onNotificationsPress: () => void;
};

export default function HomeHeader({
  searchQuery,
  onSearchChange,
  onCartPress,
  onAvatarPress,
  onNotificationsPress,
}: Props) {
  const { user } = useAuth();
  const avatarLetter = user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton} onPress={onNotificationsPress}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
            <View style={styles.notifDot} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={onCartPress}>
            <Ionicons name="bag-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.avatar} onPress={onAvatarPress}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de búsqueda ahora es un TextInput funcional */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Ionicons name="close-circle" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={12} color={COLORS.accent} />
        <Text style={styles.locationLabel}>Enviando a </Text>
        <Text style={styles.locationValue}>{user?.country ?? 'Colombia'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'ios' ? 54 : 36,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: { width: LOGO_WIDTH, height: LOGO_HEIGHT },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: COLORS.white, fontSize: 13, fontWeight: '500' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
    color: COLORS.text,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  locationLabel: { color: COLORS.textSecondary, fontSize: 11 },
  locationValue: { color: COLORS.accent, fontSize: 11, fontWeight: '500' },
});