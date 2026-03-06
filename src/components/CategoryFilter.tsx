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
        <Text style={[styles.chipText, !selected && styles.chipTextSelected]}>TODOS</Text>
      </TouchableOpacity>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.value}
          style={[styles.chip, selected === cat.value && styles.chipSelected]}
          onPress={() => onSelect(selected === cat.value ? undefined : cat.value)}
        >
          <Text style={[styles.chipText, selected === cat.value && styles.chipTextSelected]}>
            {cat.label.toUpperCase()}
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
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 4,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginRight: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.goldSubtle,
    borderColor: colors.gold,
  },
  chipText: {
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
    fontWeight: '500',
  },
  chipTextSelected: { color: colors.gold },
});
