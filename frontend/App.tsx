import 'react-native-gesture-handler';
import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { AuthProvider } from './src/core/context/AuthContext';
import AppNavigator from './src/core/navigation/AppNavigator';

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

export default function App() {
  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.expotiendausa"
    >
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </StripeProvider>
  );
}