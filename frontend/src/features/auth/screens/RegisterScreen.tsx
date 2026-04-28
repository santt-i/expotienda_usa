import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  StyleSheet, ScrollView, ActivityIndicator, Image,
} from 'react-native';
import { COLORS } from '../../../core/theme/colors';
import { authService } from '../services/auth.service';

const Logo = require('../../../../assets/images/logo_expotienda.png');

export default function RegisterScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('Colombia');
  const [city, setCity] = useState('');
  const [role, setRole] = useState<'CLIENTE' | 'DISTRIBUIDOR'>('CLIENTE');
  const [loading, setLoading] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false, uppercase: false, lowercase: false,
    number: false, specialChar: false,
  });

  const validatePassword = (pass: string) => {
    const checks = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };
    setPasswordChecks(checks);
    return Object.values(checks).every(Boolean);
  };

  const validateStep1 = () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    if (!validatePassword(password)) {
      Alert.alert('Error', 'La contraseña no cumple con los requisitos');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!country || !city) {
      Alert.alert('Error', 'País y ciudad son obligatorios');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigation.goBack();
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await authService.register({ name, email, password, country, city, role });
      Alert.alert('Éxito', 'Cuenta creada. Inicia sesión.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
  const rawMsg = error?.response?.data?.message || error?.message || 'No se pudo registrar';
  const msg = Array.isArray(rawMsg) ? rawMsg.join('\n') : rawMsg;
  Alert.alert('Error', msg);
}finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoWrapper}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>

      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <View style={styles.progressContainer}>
        <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]} />
        <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]} />
        <View style={[styles.progressStep, step >= 3 && styles.progressStepActive]} />
      </View>

      {step === 1 && (
        <>
          <Text style={styles.title}>¿Quién eres?</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor={COLORS.textSecondary}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={COLORS.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={COLORS.textSecondary}
            value={password}
            onChangeText={(t) => { setPassword(t); validatePassword(t); }}
            secureTextEntry
          />
          <View style={styles.checklistContainer}>
            {[
              { key: 'length', label: '8 caracteres mínimo' },
              { key: 'uppercase', label: 'Una mayúscula' },
              { key: 'lowercase', label: 'Una minúscula' },
              { key: 'number', label: 'Un número' },
              { key: 'specialChar', label: 'Un carácter especial' },
            ].map((item) => (
              <Text
                key={item.key}
                style={[styles.checklistItem,
                  passwordChecks[item.key as keyof typeof passwordChecks] && styles.checklistItemValid]}
              >
                {passwordChecks[item.key as keyof typeof passwordChecks] ? '✓' : '○'} {item.label}
              </Text>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            placeholderTextColor={COLORS.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
            <Text style={styles.primaryButtonText}>Continuar</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>¿De dónde eres?</Text>
          <TextInput
            style={styles.input}
            placeholder="País"
            placeholderTextColor={COLORS.textSecondary}
            value={country}
            onChangeText={setCountry}
          />
          <TextInput
            style={styles.input}
            placeholder="Ciudad"
            placeholderTextColor={COLORS.textSecondary}
            value={city}
            onChangeText={setCity}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
            <Text style={styles.primaryButtonText}>Continuar</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.title}>¿Cómo usarás ExpoTiendaUSA?</Text>
          <TouchableOpacity
            style={[styles.roleCard, role === 'CLIENTE' && styles.roleCardSelected]}
            onPress={() => setRole('CLIENTE')}
          >
            <Text style={styles.roleEmoji}>🛍</Text>
            <Text style={styles.roleTitle}>Soy comprador</Text>
            <Text style={styles.roleDescription}>Compro productos colombianos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleCard, role === 'DISTRIBUIDOR' && styles.roleCardSelected]}
            onPress={() => setRole('DISTRIBUIDOR')}
          >
            <Text style={styles.roleEmoji}>🏪</Text>
            <Text style={styles.roleTitle}>Soy distribuidor</Text>
            <Text style={styles.roleDescription}>Vendo productos colombianos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.accentButton} onPress={handleRegister} disabled={loading}>
            {loading
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={styles.primaryButtonText}>Crear mi cuenta</Text>}
          </TouchableOpacity>
        </>
      )}

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.loginLink}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: COLORS.background, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 40 },
  logoWrapper: { alignItems: 'center', marginBottom: 16 },
  logo: { width: 140, height: 77 },
  backButton: { marginBottom: 16 },
  backText: { fontSize: 14, color: COLORS.accent },
  progressContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  progressStep: { flex: 1, height: 4, backgroundColor: COLORS.border, borderRadius: 2, marginHorizontal: 4 },
  progressStepActive: { backgroundColor: COLORS.accent },
  title: { fontSize: 22, fontWeight: '500', color: COLORS.text, marginBottom: 24 },
  input: { borderWidth: 0.5, borderColor: COLORS.border, borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 15, backgroundColor: COLORS.white, color: COLORS.text },
  checklistContainer: { marginBottom: 14 },
  checklistItem: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 3 },
  checklistItemValid: { color: COLORS.accent },
  primaryButton: { backgroundColor: COLORS.primaryDark, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  accentButton: { backgroundColor: COLORS.accent, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '500' },
  roleCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 20, marginBottom: 14, borderWidth: 0.5, borderColor: COLORS.border, alignItems: 'center' },
  roleCardSelected: { borderColor: COLORS.accent, borderWidth: 2 },
  roleEmoji: { fontSize: 32, marginBottom: 8 },
  roleTitle: { fontSize: 17, fontWeight: '500', color: COLORS.text, marginBottom: 4 },
  roleDescription: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'center' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  loginText: { fontSize: 14, color: COLORS.textSecondary },
  loginLink: { fontSize: 14, color: COLORS.accent, fontWeight: '500' },
});