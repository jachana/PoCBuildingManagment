import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

const BUILDING_ID = 'bld-seed-001'; // Hardcoded for PoC

export default function RegisterScreen() {
  const router = useRouter();
  const { registerMutation } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    displayName: '',
    unitNumber: '',
    phone: '',
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = () => {
    if (!form.email || !form.password || !form.fullName || !form.displayName || !form.unitNumber) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }
    if (form.password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }
    registerMutation.mutate(
      {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        fullName: form.fullName.trim(),
        displayName: form.displayName.trim(),
        unitNumber: form.unitNumber.trim(),
        buildingId: BUILDING_ID,
        phone: form.phone.trim() || undefined,
      },
      {
        onSuccess: () => {
          Alert.alert(
            'Registro exitoso',
            'Tu cuenta está pendiente de aprobación por la administración.',
            [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }],
          );
        },
        onError: (error) => Alert.alert('Error', error.message),
      },
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Tu cuenta será revisada por la administración</Text>

        <TextInput style={styles.input} placeholder="Email *" value={form.email} onChangeText={(v) => updateField('email', v)} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Contraseña * (mín. 8 caracteres)" value={form.password} onChangeText={(v) => updateField('password', v)} secureTextEntry />
        <TextInput style={styles.input} placeholder="Nombre completo *" value={form.fullName} onChangeText={(v) => updateField('fullName', v)} />
        <TextInput style={styles.input} placeholder="Nombre a mostrar *" value={form.displayName} onChangeText={(v) => updateField('displayName', v)} />
        <TextInput style={styles.input} placeholder="Número de departamento *" value={form.unitNumber} onChangeText={(v) => updateField('unitNumber', v)} />
        <TextInput style={styles.input} placeholder="Teléfono (opcional)" value={form.phone} onChangeText={(v) => updateField('phone', v)} keyboardType="phone-pad" />

        <TouchableOpacity
          style={[styles.button, registerMutation.isPending && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={registerMutation.isPending}
        >
          <Text style={styles.buttonText}>
            {registerMutation.isPending ? 'Registrando...' : 'Registrarse'}
          </Text>
        </TouchableOpacity>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>¿Ya tienes cuenta? Ingresar</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#1a1a1a' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 32, color: '#666' },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 16,
    fontSize: 16, marginBottom: 12, backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#2563eb', borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkButton: { alignItems: 'center', marginTop: 16, padding: 8 },
  linkText: { color: '#2563eb', fontSize: 14 },
});
