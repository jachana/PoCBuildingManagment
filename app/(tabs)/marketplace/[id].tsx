import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useState } from 'react';
import { usePostQuery, useUpdatePost } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import PlaceholderImage from '@/components/PlaceholderImage';
import { colors, spacing, typography, cardShadow } from '@/theme';

const { width } = Dimensions.get('window');

const CATEGORY_LABELS: Record<string, string> = {
  FURNITURE: 'Muebles', ELECTRONICS: 'Electronica', HOME_APPLIANCES: 'Electrodomesticos',
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
    return <View style={styles.center}><Text style={{ color: colors.textMuted }}>Cargando...</Text></View>;
  }

  const isOwner = user?.id === post.author.id;

  const handleMarkSold = () => {
    Alert.alert('Marcar como vendido', 'Estas seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Si, vendido',
        onPress: () => updatePost.mutate(
          { id: post.id, data: { status: 'SOLD' } },
          { onSuccess: () => router.back() },
        ),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {post.images.length > 0 ? (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setImageIndex(Math.round(e.nativeEvent.contentOffset.x / width))}>
          {post.images.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.image} contentFit="cover" />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.image}>
          <PlaceholderImage text="🛍️" size="large" />
        </View>
      )}
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

        <View style={styles.authorCard}>
          <View style={styles.authorAvatar}>
            <Text style={styles.authorAvatarText}>{post.author.displayName[0]}</Text>
          </View>
          <View>
            <Text style={styles.authorLabel}>Publicado por</Text>
            <Text style={styles.authorName}>{post.author.displayName}</Text>
          </View>
        </View>

        {isOwner && post.status === 'ACTIVE' && (
          <TouchableOpacity style={styles.soldButton} onPress={handleMarkSold} activeOpacity={0.8}>
            <Text style={styles.soldButtonText}>✅ Marcar como vendido</Text>
          </TouchableOpacity>
        )}

        {!isOwner && (
          <>
            <TouchableOpacity style={styles.reportButton} onPress={() => router.push({ pathname: '/report', params: { contentType: 'POST', contentId: post.id } })}>
              <Text style={styles.reportButtonText}>Reportar publicacion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.blockButton} onPress={() => {
              Alert.alert('Bloquear usuario', `Bloquear a ${post.author.displayName}?`, [
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
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  image: { width, height: 320 },
  dots: { flexDirection: 'row', justifyContent: 'center', paddingVertical: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.surfaceElevated, marginHorizontal: 3 },
  dotActive: { backgroundColor: colors.gold },
  content: { padding: spacing.lg },
  price: { ...typography.price, fontSize: 28, marginBottom: spacing.xs },
  title: { ...typography.displayMedium, fontSize: 22, marginBottom: spacing.sm },
  badge: { backgroundColor: colors.surfaceElevated, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: spacing.lg },
  badgeText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  description: { ...typography.body, lineHeight: 24, marginBottom: spacing.md },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.lg,
    ...cardShadow,
  },
  authorAvatar: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: colors.goldSubtle,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.md,
  },
  authorAvatarText: { fontSize: 16, fontWeight: '600', color: colors.gold },
  authorLabel: { ...typography.caption, marginBottom: 1 },
  authorName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  soldButton: { backgroundColor: colors.sage, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: spacing.sm },
  soldButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  reportButton: { borderWidth: 1, borderColor: colors.error, borderRadius: 14, padding: 14, alignItems: 'center' },
  reportButtonText: { color: colors.error, fontSize: 14 },
  blockButton: { borderWidth: 1, borderColor: colors.textMuted, borderRadius: 14, padding: 14, alignItems: 'center', marginTop: spacing.sm },
  blockButtonText: { color: colors.textMuted, fontSize: 14 },
});
