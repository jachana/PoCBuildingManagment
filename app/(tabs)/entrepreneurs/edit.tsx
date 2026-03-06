import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateProfile, useUpdateProfile, useEntrepreneursQuery } from '@/hooks/useEntrepreneurs';
import { useAuth } from '@/hooks/useAuth';
import { EntrepreneurCategory } from '@/models/entrepreneur';

const CATEGORIES: Array<{ value: EntrepreneurCategory; label: string }> = [
  { value: 'LEGAL', label: 'Legal' }, { value: 'HEALTH', label: 'Salud' },
  { value: 'DESIGN', label: 'Diseño' }, { value: 'COACHING', label: 'Coaching' },
  { value: 'PHOTOGRAPHY', label: 'Fotografía' }, { value: 'EDUCATION', label: 'Educación' },
  { value: 'TECHNOLOGY', label: 'Tecnología' }, { value: 'BEAUTY', label: 'Belleza' },
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
      Alert.alert('Error', 'Completa profesión, descripción y contacto');
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
        <Text style={styles.title}>{existingProfile ? 'Editar perfil' : 'Crear perfil de emprendedor'}</Text>

        <Text style={styles.label}>Profesión *</Text>
        <TextInput style={styles.input} value={profession} onChangeText={setProfession} placeholder="Ej: Abogado, Diseñadora Interior" maxLength={100} />

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.value} style={[styles.categoryBtn, category === cat.value && styles.categoryBtnSelected]} onPress={() => setCategory(cat.value)}>
              <Text style={[styles.categoryBtnText, category === cat.value && styles.categoryBtnTextSelected]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Descripción *</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Describe tus servicios..." multiline numberOfLines={4} maxLength={1000} />

        <Text style={styles.label}>Contacto *</Text>
        <TextInput style={styles.input} value={contactInfo} onChangeText={setContactInfo} placeholder="Teléfono, email o web" />

        <Text style={styles.label}>Descuento para residentes (opcional)</Text>
        <TextInput style={styles.input} value={residentDiscount} onChangeText={setResidentDiscount} placeholder="Ej: 20% de descuento" maxLength={200} />

        <TouchableOpacity style={[styles.submitBtn, isPending && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={isPending}>
          <Text style={styles.submitBtnText}>{isPending ? 'Guardando...' : existingProfile ? 'Guardar cambios' : 'Crear perfil'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: '#f9f9f9' },
  textArea: { height: 120, textAlignVertical: 'top' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0' },
  categoryBtnSelected: { backgroundColor: '#2563eb' },
  categoryBtnText: { fontSize: 13, color: '#666' },
  categoryBtnTextSelected: { color: '#fff', fontWeight: '600' },
  submitBtn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
