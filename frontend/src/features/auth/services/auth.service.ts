import api from '../../../core/api/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  country: string;
  city?: string;
}

const ACCESS_TOKEN_KEY = '@access_token';
const USER_KEY = '@user';

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    const { access_token } = response.data;

    if (access_token) {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access_token);

      // Decodificar el token para sacar los datos del usuario
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      const user: User = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        name: payload.name ?? email.split('@')[0],
        country: payload.country ?? '',
      };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return response.data;
  },

  async register(data: {
    email: string;
    password: string;
    name: string;
    country: string;
    city: string;
    role?: string;
  }) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async logout() {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },

  async getToken() {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    const userStr = await AsyncStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },
};