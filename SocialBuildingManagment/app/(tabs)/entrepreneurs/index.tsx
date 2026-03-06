import { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import EntrepreneurCard from '@/components/EntrepreneurCard';
import CategoryFilter from '@/components/CategoryFilter';
import { useEntrepreneursQuery } from '@/hooks/useEntrepreneurs';

const CATEGORIES = [
  { value: 'LEGAL', label: 'Legal' }, { value: 'HEALTH', label: 'Salud' },
  { value: 'DESIGN', label: 'Diseño' }, { value: 'COACHING', label: 'Coaching' },
  { value: 'PHOTOGRAPHY', label: 'Fotografía' }, { value: 'EDUCATION', label: 'Educación' },
  { value: 'TECHNOLOGY', label: 'Tecnología' }, { value: 'BEAUTY', label: 'Belleza' },
  { value: 'FITNESS', label: 'Fitness' }, { value: 'OTHER', label: 'Otro' },
];

export default function EntrepreneursScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<string | undefined>();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useEntrepreneursQuery(category);
  const items = data?.pages.flatMap((p) => p.data) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage]);

  return (
    <View style={styles.container}>
      <CategoryFilter categories={CATEGORIES} selected={category} onSelect={setCategory} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntrepreneurCard profile={item} onPress={() => router.push(`/(tabs)/entrepreneurs/${item.id}`)} />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={() => refetch()}
        refreshing={isLoading}
        ListEmptyComponent={!isLoading ? <View style={styles.empty}><Text style={styles.emptyText}>No hay emprendedores</Text></View> : null}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={styles.loader} /> : null}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/entrepreneurs/edit')}>
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
