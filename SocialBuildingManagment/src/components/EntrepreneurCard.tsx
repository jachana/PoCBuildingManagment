import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { EntrepreneurProfile } from '@/models/entrepreneur';

interface Props {
  profile: EntrepreneurProfile;
  onPress: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  LEGAL: 'Legal', HEALTH: 'Salud', DESIGN: 'Diseño', COACHING: 'Coaching',
  PHOTOGRAPHY: 'Fotografía', EDUCATION: 'Educación', TECHNOLOGY: 'Tecnología',
  BEAUTY: 'Belleza', FITNESS: 'Fitness', OTHER: 'Otro',
};

export default function EntrepreneurCard({ profile, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
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
          <Text style={styles.discountText}>Descuento residentes: {profile.residentDiscount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginHorizontal: 16,
    marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  row: { flexDirection: 'row', marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  avatarPlaceholder: { backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  profession: { fontSize: 14, color: '#555', marginBottom: 4 },
  badge: { backgroundColor: '#f0f0f0', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' },
  badgeText: { fontSize: 12, color: '#666' },
  description: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 8 },
  discountBadge: { backgroundColor: '#ecfdf5', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start' },
  discountText: { fontSize: 12, color: '#16a34a', fontWeight: '600' },
});
