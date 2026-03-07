import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import ImagePickerComponent from '@/components/ImagePicker';
import { useCreatePost } from '@/hooks/usePosts';
import { getPresignedUrl, uploadImage } from '@/services/uploads';
import { PostCategory } from '@/models/post';
import { colors, spacing, typography } from '@/theme';

const CATEGORIES: Array<{ value: PostCategory; label: string }> = [
  { value: 'FURNITURE', label: 'Muebles' },
  { value: 'ELECTRONICS', label: 'Electronica' },
  { value: 'HOME_APPLIANCES', label: 'Electrodomesticos' },
  { value: 'CLOTHING', label: 'Ropa' },
  { value: 'SPORTS', label: 'Deportes' },
  { value: 'BOOKS', label: 'Libros' },
  { value: 'MOVING_ITEMS', label: 'Mudanza' },
  { value: 'OTHER', label: 'Otro' },
];

export default function CreatePostScreen() {
  const router = useRouter();
  const createPost = useCreatePost();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<PostCategory>('OTHER');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !price || images.length === 0) {
      Alert.alert('Error', 'Completa todos los campos y agrega al menos una imagen');
      return;
    }
    setUploading(true);
    try {
      const objectKeys = await Promise.all(
        images.map(async (uri) => {
          const { uploadUrl, objectKey } = await getPresignedUrl('image.jpg', 'image/jpeg', 'post');
          await uploadImage(uploadUrl, uri, 'image/jpeg');
          return objectKey;
        }),
      );
      createPost.mutate(
        { title: title.trim(), description: description.trim(), price: parseInt(price), category, images: objectKeys },
        {
          onSuccess: () => { Alert.alert('Publicado', 'Tu producto ha sido publicado'); router.back(); },
          onError: (err) => Alert.alert('Error', err.message),
        },
      );
    } catch (err) {
      Alert.alert('Error', 'No se pudieron subir las imagenes');
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Nueva publicacion</Text>
        <Text style={styles.screenSubtitle}>Vende algo a tus vecinos</Text>

        <Text style={styles.label}>Imagenes</Text>
        <ImagePickerComponent images={images} onImagesChange={setImages} maxImages={5} />

        <Text style={styles.label}>Titulo</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ej: Mesa de comedor" placeholderTextColor={colors.textMuted} maxLength={100} />

        <Text style={styles.label}>Descripcion</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Describe tu producto..." placeholderTextColor={colors.textMuted} multiline numberOfLines={4} maxLength={1000} />

        <Text style={styles.label}>Precio (CLP)</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="50000" placeholderTextColor={colors.textMuted} keyboardType="numeric" />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.value} style={[styles.categoryBtn, category === cat.value && styles.categoryBtnSelected]} onPress={() => setCategory(cat.value)}>
              <Text style={[styles.categoryBtnText, category === cat.value && styles.categoryBtnTextSelected]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.submitBtn, (uploading || createPost.isPending) && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={uploading || createPost.isPending} activeOpacity={0.8}>
          <Text style={styles.submitBtnText}>
            {uploading ? 'Subiendo imagenes...' : createPost.isPending ? 'Publicando...' : 'Publicar'}
          </Text>
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
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  categoryBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.surfaceBorder,
  },
  categoryBtnSelected: { backgroundColor: colors.gold, borderColor: colors.gold },
  categoryBtnText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  categoryBtnTextSelected: { color: '#FFFFFF' },
  submitBtn: { backgroundColor: colors.gold, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: spacing.xl, marginBottom: 40 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
