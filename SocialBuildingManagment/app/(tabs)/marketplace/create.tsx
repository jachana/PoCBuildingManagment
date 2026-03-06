import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import ImagePickerComponent from '@/components/ImagePicker';
import { useCreatePost } from '@/hooks/usePosts';
import { getPresignedUrl, uploadImage } from '@/services/uploads';
import { PostCategory } from '@/models/post';

const CATEGORIES: Array<{ value: PostCategory; label: string }> = [
  { value: 'FURNITURE', label: 'Muebles' },
  { value: 'ELECTRONICS', label: 'Electrónica' },
  { value: 'HOME_APPLIANCES', label: 'Electrodomésticos' },
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
      Alert.alert('Error', 'No se pudieron subir las imágenes');
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>Imágenes *</Text>
        <ImagePickerComponent images={images} onImagesChange={setImages} maxImages={5} />

        <Text style={styles.label}>Título *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ej: Mesa de comedor" maxLength={100} />

        <Text style={styles.label}>Descripción *</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Describe tu producto..." multiline numberOfLines={4} maxLength={1000} />

        <Text style={styles.label}>Precio (CLP) *</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="50000" keyboardType="numeric" />

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[styles.categoryBtn, category === cat.value && styles.categoryBtnSelected]}
              onPress={() => setCategory(cat.value)}
            >
              <Text style={[styles.categoryBtnText, category === cat.value && styles.categoryBtnTextSelected]}>
                {cat.label}
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
            {uploading ? 'Subiendo imágenes...' : createPost.isPending ? 'Publicando...' : 'Publicar'}
          </Text>
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
