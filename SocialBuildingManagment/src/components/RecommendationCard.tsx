import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RatingStars from './RatingStars';
import { Recommendation } from '@/models/recommendation';

interface Props {
  recommendation: Recommendation;
  onPress: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  NANNY: 'Nana', TRANSPORTATION: 'Transporte', DOG_WALKER: 'Paseador de perros',
  DECORATOR: 'Decorador', ELECTRICIAN: 'Electricista', GARDENER: 'Jardinero',
  PERSONAL_TRAINER: 'Personal Trainer', PLUMBER: 'Gasf\u00edter', CLEANER: 'Aseo', OTHER: 'Otro',
};

export default function RecommendationCard({ recommendation, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.serviceName} numberOfLines={1}>{recommendation.serviceName}</Text>
        <RatingStars rating={recommendation.rating} size={16} />
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{CATEGORY_LABELS[recommendation.category] || recommendation.category}</Text>
      </View>
      <Text style={styles.comment} numberOfLines={2}>{recommendation.comment}</Text>
      <Text style={styles.author}>Recomendado por {recommendation.author.displayName}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginHorizontal: 16,
    marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  serviceName: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', flex: 1, marginRight: 8 },
  badge: { backgroundColor: '#f0f0f0', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 8 },
  badgeText: { fontSize: 12, color: '#666' },
  comment: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 8 },
  author: { fontSize: 12, color: '#999' },
});
