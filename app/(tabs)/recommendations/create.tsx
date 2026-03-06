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
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.screenTitle}>NUEVA RECOMENDACION</Text>
        <View style={styles.titleDivider} />

        <Text style={styles.label}>NOMBRE DEL SERVICIO</Text>
        <TextInput style={styles.input} value={serviceName} onChangeText={setServiceName} placeholder="Ej: Maria Gonzalez - Nana" placeholderTextColor={colors.textMuted} maxLength={100} />

        <Text style={styles.label}>CALIFICACION</Text>
        <View style={{ marginVertical: spacing.sm }}>
          <RatingStars rating={rating} interactive onRate={setRating} size={32} />
        </View>

        <Text style={styles.label}>CATEGORIA</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.value} style={[styles.categoryBtn, category === cat.value && styles.categoryBtnSelected]} onPress={() => setCategory(cat.value)}>
              <Text style={[styles.categoryBtnText, category === cat.value && styles.categoryBtnTextSelected]}>{cat.label.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>COMENTARIO</Text>
        <TextInput style={[styles.input, styles.textArea]} value={comment} onChangeText={setComment} placeholder="Describe tu experiencia..." placeholderTextColor={colors.textMuted} multiline numberOfLines={4} maxLength={500} />

        <Text style={styles.label}>CONTACTO (OPCIONAL)</Text>
        <TextInput style={styles.input} value={contactInfo} onChangeText={setContactInfo} placeholder="Telefono, email o web" placeholderTextColor={colors.textMuted} />

        <TouchableOpacity style={[styles.submitBtn, createMutation.isPending && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={createMutation.isPending}>
          <Text style={styles.submitBtnText}>{createMutation.isPending ? 'PUBLICANDO...' : 'PUBLICAR'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  screenTitle: { ...typography.subheading, fontSize: 16, textAlign: 'center', marginBottom: spacing.sm },
  titleDivider: { width: 40, height: 1, backgroundColor: colors.gold, alignSelf: 'center', marginBottom: spacing.lg },
  label: { ...typography.caption, letterSpacing: 2, color: colors.textMuted, marginBottom: 6, marginTop: spacing.md },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '300',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  categoryBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 4, borderWidth: 1, borderColor: colors.surfaceBorder },
  categoryBtnSelected: { backgroundColor: colors.goldSubtle, borderColor: colors.gold },
  categoryBtnText: { fontSize: 11, color: colors.textMuted, letterSpacing: 1 },
  categoryBtnTextSelected: { color: colors.gold, fontWeight: '500' },
  submitBtn: { borderWidth: 1, borderColor: colors.gold, borderRadius: 4, padding: 16, alignItems: 'center', marginTop: spacing.xl, marginBottom: 40 },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { color: colors.gold, fontSize: 13, fontWeight: '500', letterSpacing: 2 },
});
