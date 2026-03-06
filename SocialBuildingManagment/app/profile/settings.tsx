import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, clearTokens } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  const updateMutation = useMutation({
    mutationFn: (data: { displayName: string; phone: string }) =>
      apiFetch('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      Alert.alert('Guardado', 'Tus cambios han sido guardados');
    },
    onError: (error) => Alert.alert('Error', error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiFetch('/users/me', { method: 'DELETE' }),
    onSuccess: async () => {
      await clearTokens();
      queryClient.clear();
      router.replace('/(auth)/login');
    },
    onError: (error) => Alert.alert('Error', error.message),
  });

  const handleSave = () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'El nombre para mostrar no puede estar vacío');
      return;
    }
    updateMutation.mutate({ displayName: displayName.trim(), phone: phone.trim() });
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar mi cuenta',
      'Esta acción es irreversible. ¿Estás seguro de que deseas eliminar tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteMutation.mutate() },
      ],
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Configuración</Text>

        <Text style={styles.label}>Nombre para mostrar</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Tu nombre para mostrar"
          maxLength={50}
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Tu número de teléfono"
          keyboardType="phone-pad"
          maxLength={20}
        />

        <TouchableOpacity
          style={[styles.saveBtn, updateMutation.isPending && styles.btnDisabled]}
          onPress={handleSave}
          disabled={updateMutation.isPending}
        >
          <Text style={styles.saveBtnText}>
            {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </TouchableOpacity>

        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Zona de peligro</Text>
          <TouchableOpacity
            style={[styles.deleteBtn, deleteMutation.isPending && styles.btnDisabled]}
            onPress={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Text style={styles.deleteBtnText}>
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar mi cuenta'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: '#f9f9f9' },
  saveBtn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  btnDisabled: { opacity: 0.6 },
  dangerZone: { marginTop: 48, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#eee', marginBottom: 40 },
  dangerTitle: { fontSize: 14, fontWeight: '600', color: '#e53e3e', marginBottom: 12 },
  deleteBtn: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e53e3e' },
  deleteBtnText: { color: '#e53e3e', fontSize: 16, fontWeight: '600' },
});
