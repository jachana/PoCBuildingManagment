import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography } from '@/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginMutation } = useAuth();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    loginMutation.mutate(
      { email: email.trim().toLowerCase(), password },
      { onError: (error) => Alert.alert('Error', error.message) },
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <View style={styles.brandSection}>
          <View style={styles.logoMark}>
            <Text style={styles.logoLetter}>R</Text>
          </View>
          <Text style={styles.brandName}>THE RESIDENCE</Text>
          <View style={styles.brandDivider} />
          <Text style={styles.brandTagline}>COMUNIDAD EXCLUSIVA</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.inputLabel}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.inputLabel}>CONTRASENA</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loginMutation.isPending && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loginMutation.isPending}
          >
            <Text style={styles.buttonText}>
              {loginMutation.isPending ? 'INGRESANDO...' : 'INGRESAR'}
            </Text>
          </TouchableOpacity>
        </View>

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Solicitar acceso</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl },

  brandSection: { alignItems: 'center', marginBottom: spacing.xxl },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoLetter: {
    fontSize: 28,
    fontWeight: '200',
    color: colors.gold,
    letterSpacing: 2,
  },
  brandName: {
    ...typography.displayLarge,
    fontSize: 22,
    letterSpacing: 6,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  brandDivider: {
    width: 40,
    height: 1,
    backgroundColor: colors.gold,
    marginVertical: spacing.sm,
  },
  brandTagline: {
    ...typography.caption,
    letterSpacing: 3,
    color: colors.textMuted,
  },

  form: { marginBottom: spacing.lg },
  inputLabel: {
    ...typography.caption,
    letterSpacing: 2,
    color: colors.textMuted,
    marginBottom: 6,
    marginTop: spacing.md,
  },
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
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 3,
  },
  linkButton: { alignItems: 'center', paddingVertical: spacing.md },
  linkText: {
    color: colors.textMuted,
    fontSize: 13,
    letterSpacing: 1,
  },
});
