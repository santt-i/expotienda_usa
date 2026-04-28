import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../services/auth.service';
import { useAuth } from '../../../core/context/AuthContext';
import { COLORS } from '../../../core/theme/colors';

const Logo = require('../../../../assets/images/logo_expotienda.png');

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Campos incompletos', 'Ingresa email y contraseña');
      return;
    }

    setLoading(true);
    try {
      await authService.login(trimmedEmail, trimmedPassword);
      await signIn();
    } catch (error: any) {
  const rawMsg = error?.response?.data?.message || error?.message || 'Error desconocido';
  // Si el backend devuelve un array de errores, los unimos en un string
  const msg = Array.isArray(rawMsg) ? rawMsg.join('\n') : rawMsg;
  Alert.alert('Error al iniciar sesión', msg);
  }finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Bienvenido de nuevo</Text>
        <Text style={styles.subtitle}>Ingresa tus datos para continuar</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={COLORS.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Contraseña"
            placeholderTextColor={COLORS.textSecondary}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotLink}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={styles.primaryButtonText}>Iniciar sesión</Text>}
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>o continúa con</Text>
          <View style={styles.separatorLine} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Ionicons name="logo-google" size={20} color={COLORS.text} />
          <Text style={styles.googleButtonText}>Continuar con Google</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  logoContainer: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, alignItems: 'flex-start' },
  logo: { width: 160, height: 88 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 24, fontWeight: '500', color: COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 30 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 0.5, borderColor: COLORS.border, borderRadius: 10, backgroundColor: COLORS.white, marginBottom: 16, paddingHorizontal: 12 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: COLORS.text },
  eyeIcon: { padding: 8 },
  forgotLink: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { fontSize: 12, color: COLORS.accent },
  primaryButton: { backgroundColor: COLORS.primaryDark, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 24 },
  primaryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '500' },
  separatorContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  separatorLine: { flex: 1, height: 0.5, backgroundColor: COLORS.border },
  separatorText: { marginHorizontal: 10, fontSize: 12, color: COLORS.textSecondary },
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: COLORS.border, borderRadius: 10, paddingVertical: 12, backgroundColor: COLORS.white, marginBottom: 24 },
  googleButtonText: { marginLeft: 8, fontSize: 16, color: COLORS.text },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerText: { fontSize: 14, color: COLORS.textSecondary },
  registerLink: { fontSize: 14, color: COLORS.accent, fontWeight: '500' },
});