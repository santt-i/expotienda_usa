import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

import HomeScreen from '../../features/products/screens/HomeScreen';
import SearchScreen from '../../features/products/screens/SearchScreen';
import CartScreen from '../../features/cart/screens/CartScreen';
import OrdersScreen from '../../features/orders/screens/OrdersScreen';
import ProfileScreen from '../../features/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Definimos los íconos fuera del componente — esto es importante
// Si lo defines adentro, React recrea el objeto en cada render innecesariamente
const TAB_ICONS: Record<string, { focused: string; unfocused: string }> = {
  Inicio:   { focused: 'home',          unfocused: 'home-outline' },
  Explorar: { focused: 'search',        unfocused: 'search-outline' },
  Carrito:  { focused: 'bag',           unfocused: 'bag-outline' },
  Órdenes:  { focused: 'receipt',       unfocused: 'receipt-outline' },
  Perfil:   { focused: 'person-circle', unfocused: 'person-outline' },
};

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // headerShown false porque cada pantalla maneja su propio header
        // Esto nos da control total del diseño por pantalla
        headerShown: false,

        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },

        tabBarActiveTintColor: COLORS.primaryDark,
        tabBarInactiveTintColor: COLORS.gray,

        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0.5,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Inicio"   component={HomeScreen} />
      <Tab.Screen name="Explorar" component={SearchScreen} />
      <Tab.Screen name="Carrito"  component={CartScreen} />
      <Tab.Screen name="Órdenes"  component={OrdersScreen} />
      <Tab.Screen name="Perfil"   component={ProfileScreen} />
    </Tab.Navigator>
  );
}