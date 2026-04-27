import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../core/theme/colors';
import { useAuth } from '../../../core/context/AuthContext';

const Logo = require('../../../../assets/images/logo_expotienda.png');
const LOGO_WIDTH = 130;
const LOGO_HEIGHT = 71;

export default function HomeHeader() {
  const { user } = useAuth();
  const avatarLetter = user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
            <View style={styles.notifDot} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="bag-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
        <Ionicons name="search-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.searchPlaceholder}>Buscar productos, tiendas...</Text>
      </TouchableOpacity>

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
    backgroundColor: COLORS.white,          // fondo blanco para contraste con logo negro
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
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.background,     // gris muy claro (F7F7F7)
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
    backgroundColor: COLORS.accent,        // verde
    borderWidth: 1.5,
    borderColor: COLORS.white,             // borde blanco para que resalte
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.accent,        // verde
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '500',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.background,    // gris muy claro
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchPlaceholder: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  locationValue: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '500',
  },
});