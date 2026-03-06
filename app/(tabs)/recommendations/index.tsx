import { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import RecommendationCard from '@/components/RecommendationCard';
import CategoryFilter from '@/components/CategoryFilter';
import { useRecommendationsQuery } from '@/hooks/useRecommendations';
import { colors, spacing, typography } from '@/theme';

const CATEGORIES = [
  { value: 'NANNY', label: 'Nana' },
  { value: 'TRANSPORTATION', label: 'Transporte' },
  { value: 'DOG_WALKER', label: 'Paseador' },
  { value: 'DECORATOR', label: 'Decorador' },
  { value: 'ELECTRICIAN', label: 'Electricista' },
  { value: 'GARDENER', label: 'Jardinero' },
  { value: 'PERSONAL_TRAINER', label: 'Trainer' },
  { value: 'PLUMBER', label: 'Gasfiter' },
  { value: 'CLEANER', label: 'Aseo' },
  { value: 'OTHER', label: 'Otro' },
];

export default function RecommendationsScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<string | undefined>();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useRecommendationsQuery(category);

  const items = data?.pages.flatMap((p) => p.data) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RECOMENDACIONES</Text>
      </View>
      <CategoryFilter categories={CATEGORIES} selected={category} onSelect={setCategory} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecommendationCard recommendation={item} onPress={() => router.push(`/(tabs)/recommendations/${item.id}`)} />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={() => refetch()}
        refreshing={isLoading}
        ListEmptyComponent={!isLoading ? <View style={styles.empty}><Text style={styles.emptyText}>No hay recomendaciones</Text></View> : null}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.gold} style={styles.loader} /> : null}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/recommendations/create')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.md },
  headerTitle: { ...typography.subheading, fontSize: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { ...typography.body, color: colors.textMuted },
  loader: { padding: spacing.md },
  fab: {
    position: 'absolute', bottom: 24, right: 24, width: 52, height: 52,
    borderRadius: 26, backgroundColor: colors.gold, justifyContent: 'center',
    alignItems: 'center', elevation: 4, shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  fabText: { color: colors.background, fontSize: 24, fontWeight: '300' },
});
