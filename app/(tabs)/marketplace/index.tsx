import { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import PostCard from '@/components/PostCard';
import CategoryFilter from '@/components/CategoryFilter';
import { usePostsQuery } from '@/hooks/usePosts';
import { colors, spacing, typography } from '@/theme';

const POST_CATEGORIES = [
  { value: 'FURNITURE', label: 'Muebles' },
  { value: 'ELECTRONICS', label: 'Electronica' },
  { value: 'HOME_APPLIANCES', label: 'Electrodomesticos' },
  { value: 'CLOTHING', label: 'Ropa' },
  { value: 'SPORTS', label: 'Deportes' },
  { value: 'BOOKS', label: 'Libros' },
  { value: 'MOVING_ITEMS', label: 'Mudanza' },
  { value: 'OTHER', label: 'Otro' },
];

export default function MarketplaceScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<string | undefined>();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = usePostsQuery(category);

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <Text style={styles.headerSubtitle}>Compra y vende entre vecinos</Text>
      </View>
      <CategoryFilter categories={POST_CATEGORIES} selected={category} onSelect={setCategory} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard post={item} onPress={() => router.push(`/(tabs)/marketplace/${item.id}`)} />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={() => refetch()}
        refreshing={isLoading}
        contentContainerStyle={{ paddingTop: spacing.sm }}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📦</Text>
              <Text style={styles.emptyText}>No hay publicaciones</Text>
            </View>
          ) : null
        }
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.gold} style={styles.loader} /> : null}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/marketplace/create')} activeOpacity={0.85}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.sm },
  headerTitle: { ...typography.displayMedium },
  headerSubtitle: { ...typography.body, color: colors.textMuted, marginTop: 2 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 40, marginBottom: spacing.sm },
  emptyText: { ...typography.body, color: colors.textMuted },
  loader: { padding: spacing.md },
  fab: {
    position: 'absolute', bottom: 24, right: 24, width: 56, height: 56,
    borderRadius: 18, backgroundColor: colors.gold, justifyContent: 'center',
    alignItems: 'center', elevation: 6, shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12,
  },
  fabText: { color: '#FFFFFF', fontSize: 28, fontWeight: '400', marginTop: -2 },
});
