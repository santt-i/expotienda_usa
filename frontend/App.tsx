import 'react-native-gesture-handler';
import React from 'react';
import { AuthProvider } from './src/core/context/AuthContext';
import AppNavigator from './src/core/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}