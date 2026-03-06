import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import RatingStars from '@/components/RatingStars';
import { useRecommendationQuery } from '@/hooks/useRecommendations';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography } from '@/theme';

const CATEGORY_LABELS: Record<string, string> = {
  NANNY: 'Nana', TRANSPORTATION: 'Transporte', DOG_WALKER: 'Paseador de perros',
  DECORATOR: 'Decorador', ELECTRICIAN: 'Electricista', GARDENER: 'Jardinero',
  PERSONAL_TRAINER: 'Personal Trainer', PLUMBER: 'Gasfiter', CLEANER: 'Aseo', OTHER: 'Otro',
};

export default function RecommendationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { data: item, isLoading } = useRecommendationQuery(id);

  if (isLoading || !item) return <View style={styles.center}><Text style={{ color: colors.textMuted }}>Cargando...</Text></View>;

  const isOwner = user?.id === item.author.id;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <RatingStars rating={item.rating} size={22} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{CATEGORY_LABELS[item.category] || item.category}</Text>
        </View>
        <Text style={styles.comment}>{item.comment}</Text>
        {item.contactInfo && (
          <View style={styles.contactBox}>
            <Text style={styles.contactLabel}>CONTACTO</Text>
            <Text style={styles.contactInfo}>{item.contactInfo}</Text>
          </View>
        )}
        <View style={styles.divider} />
        <View style={styles.authorRow}>
          <Text style={styles.authorLabel}>RECOMENDADO POR</Text>
          <Text style={styles.authorName}>{item.author.displayName}</Text>
        </View>
        {!isOwner && (
          <>
            <TouchableOpacity style={styles.reportButton} onPress={() => router.push({ pathname: '/report', params: { contentType: 'RECOMMENDATION', contentId: item.id } })}>
              <Text style={styles.reportButtonText}>Reportar recomendacion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.blockButton} onPress={() => {
              Alert.alert('Bloquear usuario', `Bloquear a ${item.author.displayName}?`, [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Bloquear', style: 'destructive', onPress: async () => {
                  const { blockUser } = await import('@/services/blocks');
                  await blockUser(item.author.id);
                  Alert.alert('Usuario bloqueado');
                  router.back();
                }},
              ]);
            }}>
              <Text style={styles.blockButtonText}>Bloquear usuario</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xxl },
  serviceName: { ...typography.displayMedium, fontSize: 24, marginBottom: spacing.sm },
  badge: { backgroundColor: colors.goldSubtle, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginVertical: spacing.md },
  badgeText: { fontSize: 12, color: colors.gold, letterSpacing: 0.5, fontWeight: '500' },
  comment: { ...typography.body, lineHeight: 24, marginBottom: spacing.md },
  contactBox: { backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.surfaceBorder, padding: spacing.md, marginBottom: spacing.md },
  contactLabel: { ...typography.caption, letterSpacing: 2, marginBottom: 4 },
  contactInfo: { ...typography.body, color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },
  authorRow: { marginBottom: spacing.lg },
  authorLabel: { ...typography.caption, letterSpacing: 2, marginBottom: 4 },
  authorName: { ...typography.heading, fontSize: 15 },
  reportButton: { borderWidth: 1, borderColor: colors.error, borderRadius: 4, padding: 16, alignItems: 'center' },
  reportButtonText: { color: colors.error, fontSize: 13 },
  blockButton: { borderWidth: 1, borderColor: colors.textMuted, borderRadius: 4, padding: 16, alignItems: 'center', marginTop: spacing.sm },
  blockButtonText: { color: colors.textMuted, fontSize: 13 },
});
