import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useEntrepreneurQuery } from '@/hooks/useEntrepreneurs';
import { useAuth } from '@/hooks/useAuth';

const CATEGORY_LABELS: Record<string, string> = {
  LEGAL: 'Legal', HEALTH: 'Salud', DESIGN: 'Diseño', COACHING: 'Coaching',
  PHOTOGRAPHY: 'Fotografía', EDUCATION: 'Educación', TECHNOLOGY: 'Tecnología',
  BEAUTY: 'Belleza', FITNESS: 'Fitness', OTHER: 'Otro',
};

export default function EntrepreneurDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { data: profile, isLoading } = useEntrepreneurQuery(id);

  if (isLoading || !profile) return <View style={styles.center}><Text>Cargando...</Text></View>;
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
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{profile.description}</Text>
        <Text style={styles.sectionTitle}>Contacto</Text>
        <Text style={styles.contactInfo}>{profile.contactInfo}</Text>
        {profile.residentDiscount && (
          <>
            <Text style={styles.sectionTitle}>Descuento para residentes</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{profile.residentDiscount}</Text>
            </View>
          </>
        )}
        {isOwner && (
          <TouchableOpacity style={styles.editButton} onPress={() => router.push('/(tabs)/entrepreneurs/edit')}>
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>
        )}
        {!isOwner && (
          <>
            <TouchableOpacity style={styles.reportButton} onPress={() => router.push({ pathname: '/report', params: { contentType: 'ENTREPRENEUR', contentId: profile.id } })}>
              <Text style={styles.reportButtonText}>Reportar perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.blockButton} onPress={() => {
              Alert.alert('Bloquear usuario', `¿Bloquear a ${profile.user.displayName}?`, [
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
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', paddingVertical: 32, backgroundColor: '#f9f9f9' },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  avatarPlaceholder: { backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a' },
  profession: { fontSize: 16, color: '#555', marginBottom: 8 },
  badge: { backgroundColor: '#e0e0e0', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 13, color: '#666' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#999', marginTop: 16, marginBottom: 8, textTransform: 'uppercase' },
  description: { fontSize: 15, color: '#333', lineHeight: 22 },
  contactInfo: { fontSize: 15, color: '#333' },
  discountBadge: { backgroundColor: '#ecfdf5', borderRadius: 8, padding: 12 },
  discountText: { fontSize: 14, color: '#16a34a', fontWeight: '600' },
  editButton: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  editButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  reportButton: { borderWidth: 1, borderColor: '#dc2626', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 },
  reportButtonText: { color: '#dc2626', fontSize: 14 },
  blockButton: { borderWidth: 1, borderColor: '#666', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 },
  blockButtonText: { color: '#666', fontSize: 14 },
});
