import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function EntrepreneursLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
