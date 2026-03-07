import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import RatingStars from '@/components/RatingStars';
import { useCreateRecommendation } from '@/hooks/useRecommendations';
import { RecommendationCategory } from '@/models/recommendation';
import { colors, spacing, typography } from '@/theme';

const CATEGORIES: Array<{ value: RecommendationCategory; label: string }> = [
  { value: 'NANNY', label: 'Nana' }, { value: 'TRANSPORTATION', label: 'Transporte' },
  { value: 'DOG_WALKER', label: 'Paseador' }, { value: 'DECORATOR', label: 'Decorador' },
  { value: 'ELECTRICIAN', label: 'Electricista' }, { value: 'GARDENER', label: 'Jardinero' },
  { value: 'PERSONAL_TRAINER', label: 'Trainer' }, { value: 'PLUMBER', label: 'Gasfiter' },
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
      Alert.alert('Error', 'Completa nombre, calificacion y comentario');
      return;
    }
    createMutation.mutate(
      { serviceName: serviceName.trim(), category, rating, comment: comment.trim(), contactInfo: contactInfo.trim() || undefined },
      {
        onSuccess: () => { Alert.alert('Publicado', 'Tu recomendacion ha sido publicada'); router.back(); },
        onError: (err) => Alert.alert('Error', err.message),
      },
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Nueva recomendacion</Text>
        <Text style={styles.screenSubtitle}>Comparte un servicio con la comunidad</Text>

        <Text style={styles.label}>Nombre del servicio</Text>
        <TextInput style={styles.input} value={serviceName} onChangeText={setServiceName} placeholder="Ej: Maria Gonzalez - Nana" placeholderTextColor={colors.textMuted} maxLength={100} />

        <Text style={styles.label}>Calificacion</Text>
        <View style={{ marginVertical: spacing.sm }}>
          <RatingStars rating={rating} interactive onRate={setRating} size={32} />
        </View>

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.value} style={[styles.categoryBtn, category === cat.value && styles.categoryBtnSelected]} onPress={() => setCategory(cat.value)}>
              <Text style={[styles.categoryBtnText, category === cat.value && styles.categoryBtnTextSelected]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Comentario</Text>
        <TextInput style={[styles.input, styles.textArea]} value={comment} onChangeText={setComment} placeholder="Describe tu experiencia..." placeholderTextColor={colors.textMuted} multiline numberOfLines={4} maxLength={500} />

        <Text style={styles.label}>Contacto (opcional)</Text>
        <TextInput style={styles.input} value={contactInfo} onChangeText={setContactInfo} placeholder="Telefono, email o web" placeholderTextColor={colors.textMuted} />

        <TouchableOpacity style={[styles.submitBtn, createMutation.isPending && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={createMutation.isPending} activeOpacity={0.8}>
          <Text style={styles.submitBtnText}>{createMutation.isPending ? 'Publicando...' : 'Publicar recomendacion'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  screenTitle: { ...typography.displayMedium, marginBottom: 2 },
  screenSubtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg },
  label: { ...typography.caption, color: colors.textSecondary, fontWeight: '600', marginBottom: 6, marginTop: spacing.md },
  input: {
    backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: spacing.md,
    paddingVertical: 14, fontSize: 16, color: colors.textPrimary, borderWidth: 1, borderColor: colors.surfaceBorder,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  categoryBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.surfaceBorder },
  categoryBtnSelected: { backgroundColor: colors.gold, borderColor: colors.gold },
  categoryBtnText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  categoryBtnTextSelected: { color: '#FFFFFF' },
  submitBtn: { backgroundColor: colors.gold, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: spacing.xl, marginBottom: 40 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
