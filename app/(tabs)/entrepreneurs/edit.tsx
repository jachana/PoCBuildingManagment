import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateProfile, useUpdateProfile, useEntrepreneursQuery } from '@/hooks/useEntrepreneurs';
import { useAuth } from '@/hooks/useAuth';
import { EntrepreneurCategory } from '@/models/entrepreneur';
import { colors, spacing, typography } from '@/theme';

const CATEGORIES: Array<{ value: EntrepreneurCategory; label: string }> = [
  { value: 'LEGAL', label: 'Legal' }, { value: 'HEALTH', label: 'Salud' },
  { value: 'DESIGN', label: 'Diseno' }, { value: 'COACHING', label: 'Coaching' },
  { value: 'PHOTOGRAPHY', label: 'Fotografia' }, { value: 'EDUCATION', label: 'Educacion' },
  { value: 'TECHNOLOGY', label: 'Tecnologia' }, { value: 'BEAUTY', label: 'Belleza' },
  { value: 'FITNESS', label: 'Fitness' }, { value: 'OTHER', label: 'Otro' },
];

export default function EditEntrepreneurScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();
  const { data } = useEntrepreneursQuery();

  const existingProfile = data?.pages.flatMap((p) => p.data).find((p) => p.user.id === user?.id);

  const [profession, setProfession] = useState('');
  const [category, setCategory] = useState<EntrepreneurCategory>('OTHER');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [residentDiscount, setResidentDiscount] = useState('');

  useEffect(() => {
    if (existingProfile) {
      setProfession(existingProfile.profession);
      setCategory(existingProfile.category);
      setDescription(existingProfile.description);
      setContactInfo(existingProfile.contactInfo);
      setResidentDiscount(existingProfile.residentDiscount || '');
    }
  }, [existingProfile]);

  const handleSubmit = () => {
    if (!profession.trim() || !description.trim() || !contactInfo.trim()) {
      Alert.alert('Error', 'Completa profesion, descripcion y contacto');
      return;
    }
    const formData = {
      profession: profession.trim(),
      category,
      description: description.trim(),
      contactInfo: contactInfo.trim(),
      residentDiscount: residentDiscount.trim() || undefined,
    };

    if (existingProfile) {
      updateProfile.mutate(
        { id: existingProfile.id, data: formData },
        {
          onSuccess: () => { Alert.alert('Actualizado', 'Perfil actualizado'); router.back(); },
          onError: (err) => Alert.alert('Error', err.message),
        },
      );
    } else {
      createProfile.mutate(formData, {
        onSuccess: () => { Alert.alert('Creado', 'Perfil de emprendedor creado'); router.back(); },
        onError: (err) => Alert.alert('Error', err.message),
      });
    }
  };

  const isPending = createProfile.isPending || updateProfile.isPending;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.screenTitle}>{existingProfile ? 'EDITAR PERFIL' : 'CREAR PERFIL'}</Text>
        <View style={styles.titleDivider} />

        <Text style={styles.label}>PROFESION</Text>
        <TextInput style={styles.input} value={profession} onChangeText={setProfession} placeholder="Ej: Abogado, Disenadora Interior" placeholderTextColor={colors.textMuted} maxLength={100} />

        <Text style={styles.label}>CATEGORIA</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.value} style={[styles.categoryBtn, category === cat.value && styles.categoryBtnSelected]} onPress={() => setCategory(cat.value)}>
              <Text style={[styles.categoryBtnText, category === cat.value && styles.categoryBtnTextSelected]}>{cat.label.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>DESCRIPCION</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Describe tus servicios..." placeholderTextColor={colors.textMuted} multiline numberOfLines={4} maxLength={1000} />

        <Text style={styles.label}>CONTACTO</Text>
        <TextInput style={styles.input} value={contactInfo} onChangeText={setContactInfo} placeholder="Telefono, email o web" placeholderTextColor={colors.textMuted} />

        <Text style={styles.label}>DESCUENTO RESIDENTES (OPCIONAL)</Text>
        <TextInput style={styles.input} value={residentDiscount} onChangeText={setResidentDiscount} placeholder="Ej: 20% de descuento" placeholderTextColor={colors.textMuted} maxLength={200} />

        <TouchableOpacity style={[styles.submitBtn, isPending && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={isPending}>
          <Text style={styles.submitBtnText}>{isPending ? 'GUARDANDO...' : existingProfile ? 'GUARDAR CAMBIOS' : 'CREAR PERFIL'}</Text>
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
  textArea: { height: 120, textAlignVertical: 'top' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  categoryBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 4, borderWidth: 1, borderColor: colors.surfaceBorder },
  categoryBtnSelected: { backgroundColor: colors.goldSubtle, borderColor: colors.gold },
  categoryBtnText: { fontSize: 11, color: colors.textMuted, letterSpacing: 1 },
  categoryBtnTextSelected: { color: colors.gold, fontWeight: '500' },
  submitBtn: { borderWidth: 1, borderColor: colors.gold, borderRadius: 4, padding: 16, alignItems: 'center', marginTop: spacing.xl, marginBottom: 40 },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { color: colors.gold, fontSize: 13, fontWeight: '500', letterSpacing: 2 },
});
