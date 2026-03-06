import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography } from '@/theme';

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
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }
    if (form.password.length < 8) {
      Alert.alert('Error', 'La contrasena debe tener al menos 8 caracteres');
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
            'Solicitud enviada',
            'Tu cuenta esta pendiente de aprobacion por la administracion.',
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
        <Text style={styles.title}>SOLICITAR ACCESO</Text>
        <View style={styles.titleDivider} />
        <Text style={styles.subtitle}>Tu solicitud sera revisada por la administracion</Text>

        <Text style={styles.label}>EMAIL</Text>
        <TextInput style={styles.input} value={form.email} onChangeText={(v) => updateField('email', v)} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.textMuted} />
        <Text style={styles.label}>CONTRASENA</Text>
        <TextInput style={styles.input} value={form.password} onChangeText={(v) => updateField('password', v)} secureTextEntry placeholderTextColor={colors.textMuted} />
        <Text style={styles.label}>NOMBRE COMPLETO</Text>
        <TextInput style={styles.input} value={form.fullName} onChangeText={(v) => updateField('fullName', v)} placeholderTextColor={colors.textMuted} />
        <Text style={styles.label}>NOMBRE A MOSTRAR</Text>
        <TextInput style={styles.input} value={form.displayName} onChangeText={(v) => updateField('displayName', v)} placeholderTextColor={colors.textMuted} />
        <Text style={styles.label}>DEPARTAMENTO</Text>
        <TextInput style={styles.input} value={form.unitNumber} onChangeText={(v) => updateField('unitNumber', v)} placeholderTextColor={colors.textMuted} />
        <Text style={styles.label}>TELEFONO (OPCIONAL)</Text>
        <TextInput style={styles.input} value={form.phone} onChangeText={(v) => updateField('phone', v)} keyboardType="phone-pad" placeholderTextColor={colors.textMuted} />

        <TouchableOpacity
          style={[styles.button, registerMutation.isPending && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={registerMutation.isPending}
        >
          <Text style={styles.buttonText}>
            {registerMutation.isPending ? 'ENVIANDO...' : 'ENVIAR SOLICITUD'}
          </Text>
        </TouchableOpacity>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Ya tengo acceso</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl },
  title: { ...typography.displayMedium, fontSize: 20, letterSpacing: 4, textAlign: 'center', marginBottom: spacing.sm },
  titleDivider: { width: 40, height: 1, backgroundColor: colors.gold, alignSelf: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.caption, textAlign: 'center', marginBottom: spacing.xl, color: colors.textMuted },
  label: { ...typography.caption, letterSpacing: 2, color: colors.textMuted, marginBottom: 6, marginTop: spacing.md },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  button: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: colors.gold, fontSize: 13, fontWeight: '500', letterSpacing: 3 },
  linkButton: { alignItems: 'center', marginTop: spacing.md, padding: spacing.sm },
  linkText: { color: colors.textMuted, fontSize: 13, letterSpacing: 1 },
});
