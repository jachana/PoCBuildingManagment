import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RatingStars from './RatingStars';
import { Recommendation } from '@/models/recommendation';
import { colors, spacing, typography } from '@/theme';

interface Props {
  recommendation: Recommendation;
  onPress: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  NANNY: 'Nana', TRANSPORTATION: 'Transporte', DOG_WALKER: 'Paseador de perros',
  DECORATOR: 'Decorador', ELECTRICIAN: 'Electricista', GARDENER: 'Jardinero',
  PERSONAL_TRAINER: 'Personal Trainer', PLUMBER: 'Gasfiter', CLEANER: 'Aseo', OTHER: 'Otro',
};

export default function RecommendationCard({ recommendation, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.serviceName} numberOfLines={1}>{recommendation.serviceName}</Text>
        <RatingStars rating={recommendation.rating} size={14} />
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{CATEGORY_LABELS[recommendation.category] || recommendation.category}</Text>
      </View>
      <Text style={styles.comment} numberOfLines={2}>{recommendation.comment}</Text>
      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <Text style={styles.author}>Recomendado por {recommendation.author.displayName}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  serviceName: { ...typography.heading, fontSize: 16, flex: 1, marginRight: spacing.sm },
  badge: {
    backgroundColor: colors.goldSubtle,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  badgeText: { fontSize: 11, color: colors.gold, letterSpacing: 0.5, fontWeight: '500' },
  comment: { ...typography.body, marginBottom: spacing.sm },
  footer: {},
  footerDivider: { height: 1, backgroundColor: colors.divider, marginBottom: spacing.sm },
  author: { ...typography.caption, color: colors.textMuted },
});
