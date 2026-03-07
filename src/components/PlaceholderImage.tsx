import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme';

const PALETTES = [
  ['#E8D5C4', '#C4704B'],
  ['#D4E4D9', '#7B9E87'],
  ['#E0D4C8', '#B08968'],
  ['#D9DDE4', '#6B7D8E'],
  ['#E8DDD4', '#9E7B5B'],
  ['#D4D9E4', '#7B849E'],
];

interface Props {
  text?: string;
  index?: number;
  size?: 'small' | 'medium' | 'large';
  style?: object;
}

export default function PlaceholderImage({ text, index = 0, size = 'medium', style }: Props) {
  const palette = PALETTES[index % PALETTES.length];
  const iconSize = size === 'small' ? 20 : size === 'large' ? 36 : 28;

  return (
    <View style={[styles.container, { backgroundColor: palette[0] }, style]}>
      <View style={[styles.iconCircle, { backgroundColor: palette[1] + '20' }]}>
        <Text style={[styles.icon, { fontSize: iconSize, color: palette[1] }]}>
          {text || ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: '300',
  },
});
