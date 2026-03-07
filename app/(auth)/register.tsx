import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography } from '@/theme';

const BUILDING_ID = 'bld-seed-001';

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
            'Tu cuenta esta pendiente de aprobacion.',
            [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }],
          );
        },
        onError: (error) => Alert.alert('Error', error.message),
      },
    );
  };

  const fields = [
    { key: 'email', label: 'Email', keyboard: 'email-address' as const, placeholder: 'tu@email.com' },
    { key: 'password', label: 'Contrasena', secure: true, placeholder: 'Min. 8 caracteres' },
    { key: 'fullName', label: 'Nombre completo', placeholder: 'Juan Perez' },
    { key: 'displayName', label: 'Nombre a mostrar', placeholder: 'Juan' },
    { key: 'unitNumber', label: 'Departamento', placeholder: 'Ej: 1204' },
    { key: 'phone', label: 'Telefono (opcional)', keyboard: 'phone-pad' as const, placeholder: '+56 9...' },
  ];

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>✨</Text>
          <Text style={styles.title}>Solicitar acceso</Text>
          <Text style={styles.subtitle}>Tu solicitud sera revisada por administracion</Text>
        </View>

        <View style={styles.card}>
          {fields.map((f) => (
            <View key={f.key}>
              <Text style={styles.inputLabel}>{f.label}</Text>
              <TextInput
                style={styles.input}
                value={form[f.key as keyof typeof form]}
                onChangeText={(v) => updateField(f.key, v)}
                placeholder={f.placeholder}
                placeholderTextColor={colors.textMuted}
                keyboardType={f.keyboard || 'default'}
                autoCapitalize={f.key === 'email' ? 'none' : 'words'}
                secureTextEntry={f.secure}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.button, registerMutation.isPending && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={registerMutation.isPending}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {registerMutation.isPending ? 'Enviando...' : 'Enviar solicitud'}
            </Text>
          </TouchableOpacity>
        </View>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Ya tengo cuenta. <Text style={styles.linkBold}>Ingresar</Text></Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl },

  header: { alignItems: 'center', marginBottom: spacing.lg },
  headerEmoji: { fontSize: 36, marginBottom: spacing.sm },
  title: { ...typography.displayMedium, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center' },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  inputLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: 6, marginTop: spacing.md },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  button: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  linkButton: { alignItems: 'center', paddingVertical: spacing.lg },
  linkText: { color: colors.textSecondary, fontSize: 14 },
  linkBold: { color: colors.gold, fontWeight: '600' },
});
