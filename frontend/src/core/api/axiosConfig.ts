import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'https://catarrhal-conchoidally-dawne.ngrok-free.dev';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 10000,
});

// Interceptor de request — agrega el token a cada petición
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response — maneja errores globalmente
// Esto se ejecuta ANTES de que el error llegue a cada pantalla
api.interceptors.response.use(
  // Si la respuesta es exitosa, la dejamos pasar sin tocar
  (response) => response,

  // Si hay error, lo interceptamos aquí
  async (error) => {
    // 401 = token expirado o inválido
    // En vez de mostrar error en cada pantalla, cerramos sesión automáticamente
    if (error?.response?.status === 401) {
      // Limpiamos el storage
      await AsyncStorage.removeItem('@access_token');
      await AsyncStorage.removeItem('@user');

      // El AuthContext detectará que no hay token
      // y mostrará el login automáticamente
      // No necesitamos navegar manualmente porque AppNavigator
      // ya escucha el estado de autenticación
    }

    // Rechazamos la promesa para que el catch de cada pantalla
    // también pueda manejar el error si necesita
    return Promise.reject(error);
  }
);

export default api;