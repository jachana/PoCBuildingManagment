import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useAuth } from '@/hooks/useAuth';
import { usePostsQuery } from '@/hooks/usePosts';
import { useRecommendationsQuery } from '@/hooks/useRecommendations';
import { useEntrepreneursQuery } from '@/hooks/useEntrepreneurs';
import PlaceholderImage from '@/components/PlaceholderImage';
import { colors, spacing, typography, cardShadow } from '@/theme';

function formatPrice(price: number): string {
  return `$${price.toLocaleString('es-CL')}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, logoutMutation } = useAuth();
  const postsQuery = usePostsQuery();
  const recsQuery = useRecommendationsQuery();
  const entreQuery = useEntrepreneursQuery();

  const posts = postsQuery.data?.pages.flatMap((p) => p.data).slice(0, 4) ?? [];
  const recs = recsQuery.data?.pages.flatMap((p) => p.data).slice(0, 3) ?? [];
  const entrepreneurs = entreQuery.data?.pages.flatMap((p) => p.data).slice(0, 4) ?? [];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos dias';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{greeting()} 👋</Text>
          <Text style={styles.userName}>{user?.displayName || 'Residente'}</Text>
          <View style={styles.unitBadge}>
            <Text style={styles.unitText}>Depto {user?.unitNumber || '--'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => logoutMutation.mutate()} style={styles.avatarContainer}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarText}>{user?.displayName?.[0] || 'R'}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#FDF2EC' }]} onPress={() => router.push('/(tabs)/marketplace/create')}>
          <Text style={styles.actionEmoji}>📦</Text>
          <Text style={styles.actionLabel}>Publicar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#ECF5EF' }]} onPress={() => router.push('/(tabs)/recommendations/create')}>
          <Text style={styles.actionEmoji}>⭐</Text>
          <Text style={styles.actionLabel}>Recomendar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#F0EDE8' }]} onPress={() => router.push('/(tabs)/entrepreneurs')}>
          <Text style={styles.actionEmoji}>💼</Text>
          <Text style={styles.actionLabel}>Directorio</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Marketplace */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Marketplace</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/marketplace')}>
            <Text style={styles.seeAll}>Ver todo →</Text>
          </TouchableOpacity>
        </View>
        {postsQuery.isLoading ? (
          <ActivityIndicator color={colors.gold} style={{ padding: 20 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {posts.map((post, idx) => (
              <TouchableOpacity
                key={post.id}
                style={styles.miniPostCard}
                onPress={() => router.push(`/(tabs)/marketplace/${post.id}`)}
                activeOpacity={0.8}
              >
                {post.images[0] ? (
                  <Image source={{ uri: post.images[0] }} style={styles.miniPostImage} contentFit="cover" />
                ) : (
                  <View style={styles.miniPostImage}>
                    <PlaceholderImage text="🛍️" index={idx} />
                  </View>
                )}
                <View style={styles.miniPostInfo}>
                  <Text style={styles.miniPostTitle} numberOfLines={1}>{post.title}</Text>
                  <Text style={styles.miniPostPrice}>{formatPrice(post.price)}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {posts.length === 0 && (
              <View style={styles.emptyHorizontal}>
                <Text style={styles.emptyText}>Sin publicaciones aun</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Top Recommendations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recomendaciones</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/recommendations')}>
            <Text style={styles.seeAll}>Ver todo →</Text>
          </TouchableOpacity>
        </View>
        {recsQuery.isLoading ? (
          <ActivityIndicator color={colors.gold} style={{ padding: 20 }} />
        ) : (
          recs.map((rec) => (
            <TouchableOpacity
              key={rec.id}
              style={styles.recRow}
              onPress={() => router.push(`/(tabs)/recommendations/${rec.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.recRating}>
                <Text style={styles.recRatingText}>{rec.rating.toFixed(1)}</Text>
              </View>
              <View style={styles.recInfo}>
                <Text style={styles.recName} numberOfLines={1}>{rec.serviceName}</Text>
                <Text style={styles.recComment} numberOfLines={1}>{rec.comment}</Text>
              </View>
              <Text style={styles.recArrow}>›</Text>
            </TouchableOpacity>
          ))
        )}
        {!recsQuery.isLoading && recs.length === 0 && (
          <Text style={styles.emptyText}>Sin recomendaciones aun</Text>
        )}
      </View>

      {/* Featured Entrepreneurs */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Emprendedores</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/entrepreneurs')}>
            <Text style={styles.seeAll}>Ver todo →</Text>
          </TouchableOpacity>
        </View>
        {entreQuery.isLoading ? (
          <ActivityIndicator color={colors.gold} style={{ padding: 20 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {entrepreneurs.map((ent, idx) => (
              <TouchableOpacity
                key={ent.id}
                style={styles.entreCard}
                onPress={() => router.push(`/(tabs)/entrepreneurs/${ent.id}`)}
                activeOpacity={0.8}
              >
                {ent.avatarUrl ? (
                  <Image source={{ uri: ent.avatarUrl }} style={styles.entreAvatar} contentFit="cover" />
                ) : (
                  <View style={[styles.entreAvatar, styles.entreAvatarFallback]}>
                    <Text style={styles.entreAvatarText}>{ent.user.displayName[0]}</Text>
                  </View>
                )}
                <Text style={styles.entreName} numberOfLines={1}>{ent.user.displayName}</Text>
                <Text style={styles.entreProfession} numberOfLines={1}>{ent.profession}</Text>
                {ent.residentDiscount && (
                  <View style={styles.entreDiscountBadge}>
                    <Text style={styles.entreDiscountText}>🏷️ Dcto</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            {entrepreneurs.length === 0 && (
              <View style={styles.emptyHorizontal}>
                <Text style={styles.emptyText}>Sin emprendedores aun</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 20 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + 8,
    paddingBottom: spacing.md,
  },
  headerLeft: { flex: 1 },
  greeting: { ...typography.body, color: colors.textSecondary, marginBottom: 2 },
  userName: { ...typography.displayMedium, fontSize: 26, marginBottom: spacing.sm },
  avatarContainer: {},
  avatar: { width: 48, height: 48, borderRadius: 16 },
  avatarFallback: { backgroundColor: colors.goldSubtle, justifyContent: 'center', alignItems: 'center' },
  avatarText: { ...typography.heading, color: colors.gold },
  unitBadge: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  unitText: { ...typography.caption, color: colors.textSecondary },

  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  actionEmoji: { fontSize: 22, marginBottom: 6 },
  actionLabel: { ...typography.caption, color: colors.textPrimary, fontWeight: '600' },

  section: { marginTop: spacing.md },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.heading },
  seeAll: { ...typography.caption, color: colors.gold, fontWeight: '600' },

  horizontalList: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  emptyHorizontal: { paddingVertical: spacing.xl, paddingHorizontal: spacing.md },
  emptyText: { ...typography.body, color: colors.textMuted },

  miniPostCard: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...cardShadow,
  },
  miniPostImage: { width: '100%', height: 110 },
  miniPostInfo: { padding: spacing.sm + 2 },
  miniPostTitle: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  miniPostPrice: { ...typography.price, fontSize: 15 },

  recRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...cardShadow,
  },
  recRating: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FDF2EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  recRatingText: { fontSize: 16, fontWeight: '700', color: colors.gold },
  recInfo: { flex: 1 },
  recName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  recComment: { ...typography.body, fontSize: 13 },
  recArrow: { fontSize: 22, color: colors.textMuted, marginLeft: spacing.sm },

  entreCard: {
    width: 120,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    ...cardShadow,
  },
  entreAvatar: { width: 52, height: 52, borderRadius: 16, marginBottom: spacing.sm },
  entreAvatarFallback: { backgroundColor: colors.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  entreAvatarText: { fontSize: 20, fontWeight: '600', color: colors.gold },
  entreName: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, textAlign: 'center', marginBottom: 2 },
  entreProfession: { ...typography.caption, textAlign: 'center' },
  entreDiscountBadge: {
    marginTop: 6,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: colors.sageMuted,
  },
  entreDiscountText: { fontSize: 10, color: colors.sage, fontWeight: '600' },
});
