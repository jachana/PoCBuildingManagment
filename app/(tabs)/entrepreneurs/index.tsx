import { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import EntrepreneurCard from '@/components/EntrepreneurCard';
import CategoryFilter from '@/components/CategoryFilter';
import { useEntrepreneursQuery } from '@/hooks/useEntrepreneurs';
import { colors, spacing, typography } from '@/theme';

const CATEGORIES = [
  { value: 'LEGAL', label: 'Legal' }, { value: 'HEALTH', label: 'Salud' },
  { value: 'DESIGN', label: 'Diseno' }, { value: 'COACHING', label: 'Coaching' },
  { value: 'PHOTOGRAPHY', label: 'Fotografia' }, { value: 'EDUCATION', label: 'Educacion' },
  { value: 'TECHNOLOGY', label: 'Tecnologia' }, { value: 'BEAUTY', label: 'Belleza' },
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emprendedores</Text>
        <Text style={styles.headerSubtitle}>Profesionales de tu comunidad</Text>
      </View>
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
        contentContainerStyle={{ paddingTop: spacing.sm }}
        ListEmptyComponent={!isLoading ? <View style={styles.empty}><Text style={styles.emptyEmoji}>💼</Text><Text style={styles.emptyText}>No hay emprendedores</Text></View> : null}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.gold} style={styles.loader} /> : null}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/entrepreneurs/edit')} activeOpacity={0.85}>
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
