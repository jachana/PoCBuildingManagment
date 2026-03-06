import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Post } from '@/models/post';

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
  ELECTRONICS: 'Electrónica',
  HOME_APPLIANCES: 'Electrodomésticos',
  CLOTHING: 'Ropa',
  SPORTS: 'Deportes',
  BOOKS: 'Libros',
  MOVING_ITEMS: 'Mudanza',
  OTHER: 'Otro',
};

export default function PostCard({ post, onPress }: PostCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {post.images[0] && (
        <Image source={{ uri: post.images[0] }} style={styles.image} contentFit="cover" />
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{post.title}</Text>
        <Text style={styles.price}>{formatPrice(post.price)}</Text>
        <View style={styles.meta}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{CATEGORY_LABELS[post.category] || post.category}</Text>
          </View>
          <Text style={styles.time}>{timeAgo(post.createdAt)}</Text>
        </View>
        <Text style={styles.author}>{post.author.displayName}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16,
    marginBottom: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  image: { width: '100%', height: 180 },
  content: { padding: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
  price: { fontSize: 18, fontWeight: 'bold', color: '#2563eb', marginBottom: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  badge: { backgroundColor: '#f0f0f0', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  badgeText: { fontSize: 12, color: '#666' },
  time: { fontSize: 12, color: '#999' },
  author: { fontSize: 12, color: '#999' },
});
