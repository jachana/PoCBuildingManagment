import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { createReport } from '@/services/reports';
import { ReportReason, ContentType } from '@/models/report';

const REASONS: Array<{ value: ReportReason; label: string }> = [
  { value: 'INAPPROPRIATE', label: 'Contenido inapropiado' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'WRONG_CATEGORY', label: 'Categoría incorrecta' },
  { value: 'SCAM', label: 'Posible estafa' },
  { value: 'OTHER', label: 'Otro' },
];

export default function ReportScreen() {
  const router = useRouter();
  const { contentType, contentId } = useLocalSearchParams<{ contentType: ContentType; contentId: string }>();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState('');

  const mutation = useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      Alert.alert('Reporte enviado', 'Gracias por tu reporte. Lo revisaremos a la brevedad.');
      router.back();
    },
    onError: (error) => Alert.alert('Error', error.message),
  });

  const handleSubmit = () => {
    if (!reason) {
      Alert.alert('Error', 'Selecciona un motivo para el reporte');
      return;
    }
    if (!contentType || !contentId) {
      Alert.alert('Error', 'Información de contenido no disponible');
      return;
    }
    mutation.mutate({
      contentType,
      contentId,
      reason,
      description: description.trim() || undefined,
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Reportar contenido</Text>
        <Text style={styles.subtitle}>Selecciona el motivo del reporte</Text>

        <View style={styles.reasonList}>
          {REASONS.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={styles.reasonRow}
              onPress={() => setReason(item.value)}
            >
              <View style={[styles.radio, reason === item.value && styles.radioSelected]}>
                {reason === item.value && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.reasonText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Descripción adicional</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción adicional (opcional)"
          multiline
          numberOfLines={4}
          maxLength={500}
        />

        <TouchableOpacity
          style={[styles.submitBtn, mutation.isPending && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={mutation.isPending}
        >
          <Text style={styles.submitBtnText}>
            {mutation.isPending ? 'Enviando...' : 'Enviar reporte'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 16 },
  reasonList: { gap: 4 },
  reasonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#ccc',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  radioSelected: { borderColor: '#2563eb' },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#2563eb' },
  reasonText: { fontSize: 16, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: '#f9f9f9' },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
