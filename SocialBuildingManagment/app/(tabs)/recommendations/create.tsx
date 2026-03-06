import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import RatingStars from '@/components/RatingStars';
import { useCreateRecommendation } from '@/hooks/useRecommendations';
import { RecommendationCategory } from '@/models/recommendation';

const CATEGORIES: Array<{ value: RecommendationCategory; label: string }> = [
  { value: 'NANNY', label: 'Nana' }, { value: 'TRANSPORTATION', label: 'Transporte' },
  { value: 'DOG_WALKER', label: 'Paseador' }, { value: 'DECORATOR', label: 'Decorador' },
  { value: 'ELECTRICIAN', label: 'Electricista' }, { value: 'GARDENER', label: 'Jardinero' },
  { value: 'PERSONAL_TRAINER', label: 'Trainer' }, { value: 'PLUMBER', label: 'Gasf\u00edter' },
  { value: 'CLEANER', label: 'Aseo' }, { value: 'OTHER', label: 'Otro' },
];

export default function CreateRecommendationScreen() {
  const router = useRouter();
  const createMutation = useCreateRecommendation();
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState<RecommendationCategory>('OTHER');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const handleSubmit = () => {
    if (!serviceName.trim() || !comment.trim() || rating === 0) {
      Alert.alert('Error', 'Completa nombre, calificaci\u00f3n y comentario');
      return;
    }
    createMutation.mutate(
      { serviceName: serviceName.trim(), category, rating, comment: comment.trim(), contactInfo: contactInfo.trim() || undefined },
      {
        onSuccess: () => { Alert.alert('Publicado', 'Tu recomendaci\u00f3n ha sido publicada'); router.back(); },
        onError: (err) => Alert.alert('Error', err.message),
      },
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>Nombre del servicio *</Text>
        <TextInput style={styles.input} value={serviceName} onChangeText={setServiceName} placeholder="Ej: Mar\u00eda Gonz\u00e1lez - Nana" maxLength={100} />

        <Text style={styles.label}>Calificaci\u00f3n *</Text>
        <RatingStars rating={rating} interactive onRate={setRating} size={32} />

        <Text style={styles.label}>Categor\u00eda</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.value} style={[styles.categoryBtn, category === cat.value && styles.categoryBtnSelected]} onPress={() => setCategory(cat.value)}>
              <Text style={[styles.categoryBtnText, category === cat.value && styles.categoryBtnTextSelected]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Comentario *</Text>
        <TextInput style={[styles.input, styles.textArea]} value={comment} onChangeText={setComment} placeholder="Describe tu experiencia..." multiline numberOfLines={4} maxLength={500} />

        <Text style={styles.label}>Contacto (opcional)</Text>
        <TextInput style={styles.input} value={contactInfo} onChangeText={setContactInfo} placeholder="Tel\u00e9fono, email o web" />

        <TouchableOpacity style={[styles.submitBtn, createMutation.isPending && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={createMutation.isPending}>
          <Text style={styles.submitBtnText}>{createMutation.isPending ? 'Publicando...' : 'Publicar recomendaci\u00f3n'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: '#f9f9f9' },
  textArea: { height: 100, textAlignVertical: 'top' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0' },
  categoryBtnSelected: { backgroundColor: '#2563eb' },
  categoryBtnText: { fontSize: 13, color: '#666' },
  categoryBtnTextSelected: { color: '#fff', fontWeight: '600' },
  submitBtn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
