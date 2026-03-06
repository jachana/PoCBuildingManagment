import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useEntrepreneurQuery } from '@/hooks/useEntrepreneurs';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography } from '@/theme';

const CATEGORY_LABELS: Record<string, string> = {
  LEGAL: 'Legal', HEALTH: 'Salud', DESIGN: 'Diseno', COACHING: 'Coaching',
  PHOTOGRAPHY: 'Fotografia', EDUCATION: 'Educacion', TECHNOLOGY: 'Tecnologia',
  BEAUTY: 'Belleza', FITNESS: 'Fitness', OTHER: 'Otro',
};

export default function EntrepreneurDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { data: profile, isLoading } = useEntrepreneurQuery(id);

  if (isLoading || !profile) return <View style={styles.center}><Text style={{ color: colors.textMuted }}>Cargando...</Text></View>;
  const isOwner = user?.id === profile.user.id;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {profile.avatarUrl ? (
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{profile.user.displayName[0]}</Text>
          </View>
        )}
        <Text style={styles.name}>{profile.user.displayName}</Text>
        <Text style={styles.profession}>{profile.profession}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{CATEGORY_LABELS[profile.category] || profile.category}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>DESCRIPCION</Text>
        <Text style={styles.description}>{profile.description}</Text>
        <Text style={styles.sectionTitle}>CONTACTO</Text>
        <Text style={styles.contactInfo}>{profile.contactInfo}</Text>
        {profile.residentDiscount && (
          <>
            <Text style={styles.sectionTitle}>DESCUENTO RESIDENTES</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{profile.residentDiscount}</Text>
            </View>
          </>
        )}
        {isOwner && (
          <TouchableOpacity style={styles.editButton} onPress={() => router.push('/(tabs)/entrepreneurs/edit')}>
            <Text style={styles.editButtonText}>EDITAR PERFIL</Text>
          </TouchableOpacity>
        )}
        {!isOwner && (
          <>
            <TouchableOpacity style={styles.reportButton} onPress={() => router.push({ pathname: '/report', params: { contentType: 'ENTREPRENEUR', contentId: profile.id } })}>
              <Text style={styles.reportButtonText}>Reportar perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.blockButton} onPress={() => {
              Alert.alert('Bloquear usuario', `Bloquear a ${profile.user.displayName}?`, [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Bloquear', style: 'destructive', onPress: async () => {
                  const { blockUser } = await import('@/services/blocks');
                  await blockUser(profile.user.id);
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
  header: { alignItems: 'center', paddingVertical: spacing.xxl, borderBottomWidth: 1, borderBottomColor: colors.divider },
  avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: spacing.md, borderWidth: 1.5, borderColor: colors.gold },
  avatarPlaceholder: { backgroundColor: colors.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: colors.gold, fontSize: 32, fontWeight: '200' },
  name: { ...typography.displayMedium, fontSize: 22, marginBottom: 4 },
  profession: { ...typography.body, marginBottom: spacing.sm },
  badge: { backgroundColor: colors.goldSubtle, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 12, color: colors.gold, letterSpacing: 0.5, fontWeight: '500' },
  content: { padding: spacing.lg },
  sectionTitle: { ...typography.caption, letterSpacing: 2, color: colors.textMuted, marginTop: spacing.lg, marginBottom: spacing.sm },
  description: { ...typography.body, lineHeight: 24 },
  contactInfo: { ...typography.body, color: colors.textPrimary },
  discountBadge: { backgroundColor: colors.goldSubtle, borderRadius: 8, padding: spacing.md },
  discountText: { fontSize: 14, color: colors.success, fontWeight: '500' },
  editButton: { borderWidth: 1, borderColor: colors.gold, borderRadius: 4, padding: 16, alignItems: 'center', marginTop: spacing.xl },
  editButtonText: { color: colors.gold, fontSize: 12, fontWeight: '500', letterSpacing: 2 },
  reportButton: { borderWidth: 1, borderColor: colors.error, borderRadius: 4, padding: 16, alignItems: 'center', marginTop: spacing.md },
  reportButtonText: { color: colors.error, fontSize: 13 },
  blockButton: { borderWidth: 1, borderColor: colors.textMuted, borderRadius: 4, padding: 16, alignItems: 'center', marginTop: spacing.sm },
  blockButtonText: { color: colors.textMuted, fontSize: 13 },
});
