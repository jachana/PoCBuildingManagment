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
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.screenTitle}>NUEVA PUBLICACION</Text>
        <View style={styles.titleDivider} />

        <Text style={styles.label}>IMAGENES</Text>
        <ImagePickerComponent images={images} onImagesChange={setImages} maxImages={5} />

        <Text style={styles.label}>TITULO</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ej: Mesa de comedor" placeholderTextColor={colors.textMuted} maxLength={100} />

        <Text style={styles.label}>DESCRIPCION</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Describe tu producto..." placeholderTextColor={colors.textMuted} multiline numberOfLines={4} maxLength={1000} />

        <Text style={styles.label}>PRECIO (CLP)</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="50000" placeholderTextColor={colors.textMuted} keyboardType="numeric" />

        <Text style={styles.label}>CATEGORIA</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[styles.categoryBtn, category === cat.value && styles.categoryBtnSelected]}
              onPress={() => setCategory(cat.value)}
            >
              <Text style={[styles.categoryBtnText, category === cat.value && styles.categoryBtnTextSelected]}>
                {cat.label.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, (uploading || createPost.isPending) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={uploading || createPost.isPending}
        >
          <Text style={styles.submitBtnText}>
            {uploading ? 'SUBIENDO IMAGENES...' : createPost.isPending ? 'PUBLICANDO...' : 'PUBLICAR'}
          </Text>
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
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  categoryBtnSelected: { backgroundColor: colors.goldSubtle, borderColor: colors.gold },
  categoryBtnText: { fontSize: 11, color: colors.textMuted, letterSpacing: 1 },
  categoryBtnTextSelected: { color: colors.gold, fontWeight: '500' },
  submitBtn: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: 40,
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { color: colors.gold, fontSize: 13, fontWeight: '500', letterSpacing: 2 },
});
