import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useAuth } from '@/hooks/useAuth';
import { usePostsQuery } from '@/hooks/usePosts';
import { useRecommendationsQuery } from '@/hooks/useRecommendations';
import { useEntrepreneursQuery } from '@/hooks/useEntrepreneurs';
import { colors, spacing, typography } from '@/theme';

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{greeting()}</Text>
            <Text style={styles.userName}>{user?.displayName || 'Residente'}</Text>
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
        <View style={styles.unitBadge}>
          <Text style={styles.unitText}>DEPTO {user?.unitNumber || '--'}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/marketplace/create')}>
          <Text style={styles.actionIcon}>+</Text>
          <Text style={styles.actionLabel}>PUBLICAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/recommendations/create')}>
          <Text style={styles.actionIcon}>*</Text>
          <Text style={styles.actionLabel}>RECOMENDAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/entrepreneurs')}>
          <Text style={styles.actionIcon}>&</Text>
          <Text style={styles.actionLabel}>DIRECTORIO</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Marketplace */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MARKETPLACE</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/marketplace')}>
            <Text style={styles.seeAll}>Ver todo</Text>
          </TouchableOpacity>
        </View>
        {postsQuery.isLoading ? (
          <ActivityIndicator color={colors.gold} style={{ padding: 20 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {posts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={styles.miniPostCard}
                onPress={() => router.push(`/(tabs)/marketplace/${post.id}`)}
              >
                {post.images[0] ? (
                  <Image source={{ uri: post.images[0] }} style={styles.miniPostImage} contentFit="cover" />
                ) : (
                  <View style={[styles.miniPostImage, styles.miniPostPlaceholder]}>
                    <Text style={styles.placeholderText}>Sin imagen</Text>
                  </View>
                )}
                <View style={styles.miniPostInfo}>
                  <Text style={styles.miniPostTitle} numberOfLines={1}>{post.title}</Text>
                  <Text style={styles.miniPostPrice}>{formatPrice(post.price)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Top Recommendations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECOMENDACIONES</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/recommendations')}>
            <Text style={styles.seeAll}>Ver todo</Text>
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
            >
              <View style={styles.recRating}>
                <Text style={styles.recRatingText}>{rec.rating.toFixed(1)}</Text>
                <Text style={styles.recStar}>&#9733;</Text>
              </View>
              <View style={styles.recInfo}>
                <Text style={styles.recName} numberOfLines={1}>{rec.serviceName}</Text>
                <Text style={styles.recComment} numberOfLines={1}>{rec.comment}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Featured Entrepreneurs */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>EMPRENDEDORES</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/entrepreneurs')}>
            <Text style={styles.seeAll}>Ver todo</Text>
          </TouchableOpacity>
        </View>
        {entreQuery.isLoading ? (
          <ActivityIndicator color={colors.gold} style={{ padding: 20 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {entrepreneurs.map((ent) => (
              <TouchableOpacity
                key={ent.id}
                style={styles.entreCard}
                onPress={() => router.push(`/(tabs)/entrepreneurs/${ent.id}`)}
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
                    <Text style={styles.entreDiscountText}>Dcto residentes</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
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

  // Header
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.lg },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flex: 1 },
  greeting: { ...typography.caption, letterSpacing: 2, textTransform: 'uppercase', color: colors.textMuted, marginBottom: 4 },
  userName: { ...typography.displayMedium },
  avatarContainer: { marginLeft: spacing.md },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: colors.gold },
  avatarFallback: { backgroundColor: colors.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  avatarText: { ...typography.heading, color: colors.gold },
  unitBadge: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  unitText: { ...typography.caption, letterSpacing: 2, color: colors.goldMuted },

  divider: { height: 1, backgroundColor: colors.divider, marginHorizontal: spacing.lg },

  // Quick Actions
  quickActions: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, gap: spacing.sm },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  actionIcon: { fontSize: 20, color: colors.gold, marginBottom: 6 },
  actionLabel: { ...typography.caption, letterSpacing: 1.5, color: colors.textSecondary },

  // Sections
  section: { marginTop: spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.subheading },
  seeAll: { ...typography.caption, color: colors.goldMuted },

  // Horizontal List
  horizontalList: { paddingHorizontal: spacing.lg, gap: spacing.sm },

  // Mini Post Cards
  miniPostCard: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    overflow: 'hidden',
  },
  miniPostImage: { width: '100%', height: 110 },
  miniPostPlaceholder: { backgroundColor: colors.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { ...typography.caption },
  miniPostInfo: { padding: spacing.sm },
  miniPostTitle: { ...typography.body, fontSize: 13, color: colors.textPrimary, marginBottom: 2 },
  miniPostPrice: { ...typography.price, fontSize: 15 },

  // Recommendation Rows
  recRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  recRating: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  recRatingText: { fontSize: 14, fontWeight: '500', color: colors.gold, marginBottom: -2 },
  recStar: { fontSize: 8, color: colors.goldMuted },
  recInfo: { flex: 1 },
  recName: { ...typography.heading, fontSize: 15, marginBottom: 2 },
  recComment: { ...typography.body, fontSize: 13 },

  // Entrepreneur Cards
  entreCard: {
    width: 120,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  entreAvatar: { width: 56, height: 56, borderRadius: 28, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.surfaceBorder },
  entreAvatarFallback: { backgroundColor: colors.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  entreAvatarText: { fontSize: 20, fontWeight: '300', color: colors.gold },
  entreName: { ...typography.body, fontSize: 13, color: colors.textPrimary, textAlign: 'center', marginBottom: 2 },
  entreProfession: { ...typography.caption, textAlign: 'center' },
  entreDiscountBadge: {
    marginTop: 6,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: colors.goldSubtle,
  },
  entreDiscountText: { fontSize: 10, color: colors.gold, letterSpacing: 0.5 },
});
