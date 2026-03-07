import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { EntrepreneurProfile } from '@/models/entrepreneur';
import { colors, spacing, typography, cardShadow } from '@/theme';

interface Props {
  profile: EntrepreneurProfile;
  onPress: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  LEGAL: 'Legal', HEALTH: 'Salud', DESIGN: 'Diseno', COACHING: 'Coaching',
  PHOTOGRAPHY: 'Fotografia', EDUCATION: 'Educacion', TECHNOLOGY: 'Tecnologia',
  BEAUTY: 'Belleza', FITNESS: 'Fitness', OTHER: 'Otro',
};

export default function EntrepreneurCard({ profile, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.row}>
        {profile.avatarUrl ? (
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{profile.user.displayName[0]}</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{profile.user.displayName}</Text>
          <Text style={styles.profession} numberOfLines={1}>{profile.profession}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{CATEGORY_LABELS[profile.category] || profile.category}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={2}>{profile.description}</Text>
      {profile.residentDiscount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>🏷️ Descuento residentes: {profile.residentDiscount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  row: { flexDirection: 'row', marginBottom: spacing.sm },
  avatar: { width: 52, height: 52, borderRadius: 16, marginRight: spacing.md },
  avatarPlaceholder: { backgroundColor: colors.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: colors.gold, fontSize: 20, fontWeight: '600' },
  info: { flex: 1 },
  name: { ...typography.heading, fontSize: 16, marginBottom: 2 },
  profession: { ...typography.body, fontSize: 13, marginBottom: 6 },
  badge: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  description: { ...typography.body, marginBottom: spacing.sm },
  discountBadge: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
  },
  discountText: { fontSize: 13, color: colors.sage, fontWeight: '600' },
});
