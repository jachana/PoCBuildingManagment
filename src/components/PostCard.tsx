import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Post } from '@/models/post';
import { colors, spacing, typography } from '@/theme';

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString('es-CL')}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

const CATEGORY_LABELS: Record<string, string> = {
  FURNITURE: 'Muebles',
  ELECTRONICS: 'Electronica',
  HOME_APPLIANCES: 'Electrodomesticos',
  CLOTHING: 'Ropa',
  SPORTS: 'Deportes',
  BOOKS: 'Libros',
  MOVING_ITEMS: 'Mudanza',
  OTHER: 'Otro',
};

export default function PostCard({ post, onPress }: PostCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {post.images[0] && (
        <Image source={{ uri: post.images[0] }} style={styles.image} contentFit="cover" />
      )}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>{post.title}</Text>
          <Text style={styles.time}>{timeAgo(post.createdAt)}</Text>
        </View>
        <Text style={styles.price}>{formatPrice(post.price)}</Text>
        <View style={styles.bottomRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{CATEGORY_LABELS[post.category] || post.category}</Text>
          </View>
          <Text style={styles.author}>{post.author.displayName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  image: { width: '100%', height: 200 },
  content: { padding: spacing.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { ...typography.heading, fontSize: 16, flex: 1, marginRight: spacing.sm },
  time: { ...typography.caption },
  price: { ...typography.price, marginBottom: spacing.sm },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: {
    backgroundColor: colors.goldSubtle,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 11, color: colors.gold, letterSpacing: 0.5, fontWeight: '500' },
  author: { ...typography.caption, color: colors.textSecondary },
});
