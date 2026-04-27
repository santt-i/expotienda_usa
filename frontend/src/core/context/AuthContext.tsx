import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, User } from '../../features/auth/services/auth.service';

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const token = await AsyncStorage.getItem('@access_token');
        const storedUser = await AsyncStorage.getItem('@user');
        setIsAuthenticated(!!token);
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error('Error loading auth data', error);
      } finally {
        setLoading(false);
      }
    };
    loadStoredData();
  }, []);

  const signIn = async () => {
    const token = await AsyncStorage.getItem('@access_token');
    const storedUser = await AsyncStorage.getItem('@user');
    setIsAuthenticated(!!token);
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('@access_token');
    await AsyncStorage.removeItem('@user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);