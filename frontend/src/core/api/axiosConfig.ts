import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ URL de producción en Railway (ya no usamos ngrok)
export const API_BASE_URL = 'https://expotiendausa-production.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Eliminamos el header de ngrok porque ya no lo necesitamos en producción
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
api.interceptors.response.use(
  // Si la respuesta es exitosa, la dejamos pasar sin tocar
  (response) => response,

  // Si hay error, lo interceptamos aquí
  async (error) => {
    // 401 = token expirado o inválido
    if (error?.response?.status === 401) {
      // Limpiamos el storage para forzar el cierre de sesión
      await AsyncStorage.removeItem('@access_token');
      await AsyncStorage.removeItem('@user');
    }

    // Rechazamos la promesa para que el catch de cada pantalla
    // también pueda manejar el error si lo necesita mostrar
    return Promise.reject(error);
  }
);

export default api;