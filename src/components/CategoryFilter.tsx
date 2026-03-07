import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

interface CategoryFilterProps {
  categories: Array<{ value: string; label: string }>;
  selected: string | undefined;
  onSelect: (value: string | undefined) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity
        style={[styles.chip, !selected && styles.chipSelected]}
        onPress={() => onSelect(undefined)}
      >
        <Text style={[styles.chipText, !selected && styles.chipTextSelected]}>Todos</Text>
      </TouchableOpacity>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.value}
          style={[styles.chip, selected === cat.value && styles.chipSelected]}
          onPress={() => onSelect(selected === cat.value ? undefined : cat.value)}
        >
          <Text style={[styles.chipText, selected === cat.value && styles.chipTextSelected]}>
            {cat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { maxHeight: 52 },
  content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.sm },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  chipSelected: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  chipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chipTextSelected: { color: '#FFFFFF' },
});
