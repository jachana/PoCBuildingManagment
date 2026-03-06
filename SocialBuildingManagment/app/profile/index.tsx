import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => logoutMutation.mutate() },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.avatarSection}>
        {user.avatarUrl ? (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{getInitials(user.fullName)}</Text>
          </View>
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{getInitials(user.fullName)}</Text>
          </View>
        )}
        <Text style={styles.fullName}>{user.fullName}</Text>
        <Text style={styles.displayName}>@{user.displayName}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Departamento</Text>
          <Text style={styles.infoValue}>{user.unitNumber}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
        {user.phone && (
          <>
            <View style={styles.separator} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis publicaciones</Text>
        <Text style={styles.sectionPlaceholder}>Próximamente podrás ver tus publicaciones aquí</Text>
      </View>

      <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/profile/settings')}>
        <Text style={styles.settingsBtnText}>Configuración</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.logoutBtn, logoutMutation.isPending && styles.btnDisabled]}
        onPress={handleLogout}
        disabled={logoutMutation.isPending}
      >
        <Text style={styles.logoutBtnText}>
          {logoutMutation.isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyText: { fontSize: 16, color: '#666' },
  avatarSection: { alignItems: 'center', marginBottom: 24, marginTop: 8 },
  avatarPlaceholder: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#2563eb',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  fullName: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a' },
  displayName: { fontSize: 14, color: '#666', marginTop: 2 },
  infoCard: {
    backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, marginBottom: 24,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { fontSize: 14, color: '#666' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  separator: { height: 1, backgroundColor: '#eee' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  sectionPlaceholder: { fontSize: 14, color: '#999', fontStyle: 'italic' },
  settingsBtn: {
    backgroundColor: '#2563eb', borderRadius: 12, padding: 16,
    alignItems: 'center', marginBottom: 12,
  },
  settingsBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  logoutBtn: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#e53e3e', marginBottom: 12,
  },
  logoutBtnText: { color: '#e53e3e', fontSize: 16, fontWeight: '600' },
  btnDisabled: { opacity: 0.6 },
});
