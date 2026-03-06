import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

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
  container: { maxHeight: 48 },
  content: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    backgroundColor: '#f0f0f0', marginRight: 8,
  },
  chipSelected: { backgroundColor: '#2563eb' },
  chipText: { fontSize: 13, color: '#666' },
  chipTextSelected: { color: '#fff', fontWeight: '600' },
});
