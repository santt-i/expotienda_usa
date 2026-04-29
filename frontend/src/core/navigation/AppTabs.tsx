import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../theme/colors';
import HomeScreen from '../../features/products/screens/HomeScreen';
import SearchScreen from '../../features/products/screens/SearchScreen';
import CartScreen from '../../features/cart/screens/CartScreen';
import OrdersScreen from '../../features/orders/screens/OrdersScreen';
import ProfileScreen from '../../features/profile/screens/ProfileScreen';
import AnalyticsScreen from '../../features/analytics/screens/AnalyticsScreen';
import AdminDashboardScreen from '../../features/admin/screens/AdminDashboardScreen';

const Tab = createBottomTabNavigator();

interface TabConfig {
  name: string;
  component: React.ComponentType<any>;
  iconFocused: string;
  iconUnfocused: string;
}

const COMMON_TABS: TabConfig[] = [
  { name: 'Inicio', component: HomeScreen, iconFocused: 'home', iconUnfocused: 'home-outline' },
  { name: 'Explorar', component: SearchScreen, iconFocused: 'search', iconUnfocused: 'search-outline' },
  { name: 'Carrito', component: CartScreen, iconFocused: 'bag', iconUnfocused: 'bag-outline' },
  { name: 'Órdenes', component: OrdersScreen, iconFocused: 'receipt', iconUnfocused: 'receipt-outline' },
  { name: 'Perfil', component: ProfileScreen, iconFocused: 'person-circle', iconUnfocused: 'person-outline' },
];

export default function AppTabs() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;
  console.log('🧪 Rol del usuario en AppTabs:', user?.role);
  console.log('🧪 ¿Es ADMIN?', user?.role === 'ADMIN');
  const canViewAnalytics = user?.role === 'ADMIN' || user?.role === 'DISTRIBUIDOR';
  const isAdmin = user?.role === 'ADMIN';
  
  // Construir array de tabs dinámicamente
  const tabs: TabConfig[] = [...COMMON_TABS];

  if (canViewAnalytics) {
    tabs.push({
      name: 'Analítica',
      component: AnalyticsScreen,
      iconFocused: 'stats-chart',
      iconUnfocused: 'stats-chart-outline',
    });
  }

  if (isAdmin) {
    tabs.push({
      name: 'Admin',
      component: AdminDashboardScreen,
      iconFocused: 'shield-checkmark',
      iconUnfocused: 'shield-outline',
    });
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const tab = tabs.find(t => t.name === route.name);
          if (!tab) return null;
          const iconName = focused ? tab.iconFocused : tab.iconUnfocused;
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primaryDark,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0.5,
          borderTopColor: COLORS.border,
          height: 56 + bottomInset,      // altura total ajustada
          paddingBottom: bottomInset,     // espacio para botones del sistema
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
      })}
    >
      {tabs.map(tab => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}