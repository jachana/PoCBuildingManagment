import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { colors, spacing } from '@/theme';

export function NetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, []);

  if (isConnected) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>SIN CONEXION</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.error,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
  },
  text: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 2,
  },
});
