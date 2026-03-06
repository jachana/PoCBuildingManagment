import { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import PostCard from '@/components/PostCard';
import CategoryFilter from '@/components/CategoryFilter';
import { usePostsQuery } from '@/hooks/usePosts';

const POST_CATEGORIES = [
  { value: 'FURNITURE', label: 'Muebles' },
  { value: 'ELECTRONICS', label: 'Electrónica' },
  { value: 'HOME_APPLIANCES', label: 'Electrodomésticos' },
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
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No hay publicaciones</Text>
            </View>
          ) : null
        }
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={styles.loader} /> : null}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/marketplace/create')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { fontSize: 16, color: '#999' },
  loader: { padding: 16 },
  fab: {
    position: 'absolute', bottom: 24, right: 24, width: 56, height: 56,
    borderRadius: 28, backgroundColor: '#2563eb', justifyContent: 'center',
    alignItems: 'center', elevation: 4, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
