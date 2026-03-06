import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme';

interface RatingStarsProps {
  rating: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: number;
}

export default function RatingStars({ rating, interactive = false, onRate, size = 20 }: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      {stars.map((star) => {
        const filled = star <= rating;
        const StarWrapper = interactive ? TouchableOpacity : View;
        return (
          <StarWrapper
            key={star}
            onPress={interactive ? () => onRate?.(star) : undefined}
            style={styles.star}
          >
            <Text style={[styles.starText, { fontSize: size }, filled && styles.starFilled]}>
              {filled ? '\u2605' : '\u2606'}
            </Text>
          </StarWrapper>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  star: { marginRight: 2 },
  starText: { color: colors.textMuted },
  starFilled: { color: colors.gold },
});
