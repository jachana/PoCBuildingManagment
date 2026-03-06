import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { EntrepreneurProfile } from '@/models/entrepreneur';
import { colors, spacing, typography } from '@/theme';

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
          <Text style={styles.discountLabel}>DESCUENTO RESIDENTES</Text>
          <Text style={styles.discountText}>{profile.residentDiscount}</Text>
        </View>
      )}
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
  row: { flexDirection: 'row', marginBottom: spacing.sm },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  avatarPlaceholder: { backgroundColor: colors.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: colors.gold, fontSize: 20, fontWeight: '200' },
  info: { flex: 1 },
  name: { ...typography.heading, fontSize: 16, marginBottom: 2 },
  profession: { ...typography.body, fontSize: 13, marginBottom: 6 },
  badge: {
    backgroundColor: colors.goldSubtle,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, color: colors.gold, letterSpacing: 0.5, fontWeight: '500' },
  description: { ...typography.body, marginBottom: spacing.sm },
  discountBadge: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountLabel: { ...typography.caption, letterSpacing: 1, color: colors.success },
  discountText: { ...typography.body, fontSize: 13, color: colors.success, fontWeight: '500' },
});
