import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useState } from 'react';
import { usePostQuery, useUpdatePost } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';

const { width } = Dimensions.get('window');

const CATEGORY_LABELS: Record<string, string> = {
  FURNITURE: 'Muebles', ELECTRONICS: 'Electrónica', HOME_APPLIANCES: 'Electrodomésticos',
  CLOTHING: 'Ropa', SPORTS: 'Deportes', BOOKS: 'Libros', MOVING_ITEMS: 'Mudanza', OTHER: 'Otro',
};

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { data: post, isLoading } = usePostQuery(id);
  const updatePost = useUpdatePost();
  const [imageIndex, setImageIndex] = useState(0);

  if (isLoading || !post) {
    return <View style={styles.center}><Text>Cargando...</Text></View>;
  }

  const isOwner = user?.id === post.author.id;

  const handleMarkSold = () => {
    Alert.alert('Marcar como vendido', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sí, vendido',
        onPress: () => updatePost.mutate(
          { id: post.id, data: { status: 'SOLD' } },
          { onSuccess: () => router.back() },
        ),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setImageIndex(Math.round(e.nativeEvent.contentOffset.x / width))}>
        {post.images.map((uri, i) => (
          <Image key={i} source={{ uri }} style={styles.image} contentFit="cover" />
        ))}
      </ScrollView>
      {post.images.length > 1 && (
        <View style={styles.dots}>
          {post.images.map((_, i) => (
            <View key={i} style={[styles.dot, i === imageIndex && styles.dotActive]} />
          ))}
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.price}>${post.price.toLocaleString('es-CL')}</Text>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{CATEGORY_LABELS[post.category] || post.category}</Text>
        </View>
        <Text style={styles.description}>{post.description}</Text>
        <View style={styles.authorRow}>
          <Text style={styles.authorLabel}>Publicado por</Text>
          <Text style={styles.authorName}>{post.author.displayName}</Text>
        </View>

        {isOwner && post.status === 'ACTIVE' && (
          <TouchableOpacity style={styles.soldButton} onPress={handleMarkSold}>
            <Text style={styles.soldButtonText}>Marcar como vendido</Text>
          </TouchableOpacity>
        )}

        {!isOwner && (
          <>
            <TouchableOpacity style={styles.reportButton} onPress={() => router.push({ pathname: '/report', params: { contentType: 'POST', contentId: post.id } })}>
              <Text style={styles.reportButtonText}>Reportar publicación</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.blockButton} onPress={() => {
              Alert.alert('Bloquear usuario', `¿Bloquear a ${post.author.displayName}?`, [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Bloquear', style: 'destructive', onPress: async () => {
                  const { blockUser } = await import('@/services/blocks');
                  await blockUser(post.author.id);
                  Alert.alert('Usuario bloqueado');
                  router.back();
                }},
              ]);
            }}>
              <Text style={styles.blockButtonText}>Bloquear usuario</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width, height: 300 },
  dots: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ddd', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#2563eb' },
  content: { padding: 16 },
  price: { fontSize: 28, fontWeight: 'bold', color: '#2563eb', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '600', color: '#1a1a1a', marginBottom: 8 },
  badge: { backgroundColor: '#f0f0f0', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 16 },
  badgeText: { fontSize: 13, color: '#666' },
  description: { fontSize: 15, color: '#333', lineHeight: 22, marginBottom: 16 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  authorLabel: { fontSize: 13, color: '#999', marginRight: 8 },
  authorName: { fontSize: 14, fontWeight: '600', color: '#333' },
  soldButton: { backgroundColor: '#16a34a', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
  soldButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  reportButton: { borderWidth: 1, borderColor: '#dc2626', borderRadius: 12, padding: 16, alignItems: 'center' },
  reportButtonText: { color: '#dc2626', fontSize: 14 },
  blockButton: { borderWidth: 1, borderColor: '#666', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 },
  blockButtonText: { color: '#666', fontSize: 14 },
});
