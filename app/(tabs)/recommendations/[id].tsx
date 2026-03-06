import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import RatingStars from '@/components/RatingStars';
import { useRecommendationQuery } from '@/hooks/useRecommendations';
import { useAuth } from '@/hooks/useAuth';

const CATEGORY_LABELS: Record<string, string> = {
  NANNY: 'Nana', TRANSPORTATION: 'Transporte', DOG_WALKER: 'Paseador de perros',
  DECORATOR: 'Decorador', ELECTRICIAN: 'Electricista', GARDENER: 'Jardinero',
  PERSONAL_TRAINER: 'Personal Trainer', PLUMBER: 'Gasf\u00edter', CLEANER: 'Aseo', OTHER: 'Otro',
};

export default function RecommendationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { data: item, isLoading } = useRecommendationQuery(id);

  if (isLoading || !item) return <View style={styles.center}><Text>Cargando...</Text></View>;

  const isOwner = user?.id === item.author.id;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <RatingStars rating={item.rating} size={24} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{CATEGORY_LABELS[item.category] || item.category}</Text>
        </View>
        <Text style={styles.comment}>{item.comment}</Text>
        {item.contactInfo && (
          <View style={styles.contactBox}>
            <Text style={styles.contactLabel}>Contacto</Text>
            <Text style={styles.contactInfo}>{item.contactInfo}</Text>
          </View>
        )}
        <View style={styles.authorRow}>
          <Text style={styles.authorLabel}>Recomendado por</Text>
          <Text style={styles.authorName}>{item.author.displayName}</Text>
        </View>
        {!isOwner && (
          <>
          <TouchableOpacity style={styles.reportButton} onPress={() => router.push({ pathname: '/report', params: { contentType: 'RECOMMENDATION', contentId: item.id } })}>
            <Text style={styles.reportButtonText}>Reportar recomendaci\u00f3n</Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.blockButton} onPress={() => {
              Alert.alert('Bloquear usuario', `¿Bloquear a ${item.author.displayName}?`, [
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
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16 },
  serviceName: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  badge: { backgroundColor: '#f0f0f0', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginVertical: 12 },
  badgeText: { fontSize: 13, color: '#666' },
  comment: { fontSize: 16, color: '#333', lineHeight: 24, marginBottom: 16 },
  contactBox: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, marginBottom: 16 },
  contactLabel: { fontSize: 12, color: '#999', marginBottom: 4 },
  contactInfo: { fontSize: 15, color: '#333' },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  authorLabel: { fontSize: 13, color: '#999', marginRight: 8 },
  authorName: { fontSize: 14, fontWeight: '600', color: '#333' },
  reportButton: { borderWidth: 1, borderColor: '#dc2626', borderRadius: 12, padding: 16, alignItems: 'center' },
  reportButtonText: { color: '#dc2626', fontSize: 14 },
  blockButton: { borderWidth: 1, borderColor: '#666', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 },
  blockButtonText: { color: '#666', fontSize: 14 },
});
