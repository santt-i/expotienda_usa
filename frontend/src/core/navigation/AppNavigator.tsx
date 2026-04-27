import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import ProductDetailScreen from '../../features/products/screens/ProductDetailScreen';
import OrderDetailScreen from '../../features/orders/screens/OrderDetailScreen';
import DashboardScreen from '../../features/distributor/screens/DashboardScreen';
import ProductsManagementScreen from '../../features/distributor/screens/ProductsManagmentScreen';
import ProductFormScreen from '../../features/distributor/screens/ProductFormScreen';
import OrdersManagementScreen from '../../features/distributor/screens/OrdersManagmentScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={AppTabs} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="ProductManagement" component={ProductsManagementScreen} />
            <Stack.Screen name="ProductForm" component={ProductFormScreen} />
            <Stack.Screen name="OrderManagement" component={OrdersManagementScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}