import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { NetworkStatus } from '@/components/NetworkStatus';
import { colors } from '@/theme';

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <NetworkStatus />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.gold,
          tabBarInactiveTintColor: colors.textMuted,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.divider,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Inicio',
}}
        />
        <Tabs.Screen
          name="marketplace"
          options={{
            title: 'Market',
          }}
        />
        <Tabs.Screen
          name="recommendations"
          options={{
            title: 'Servicios',
          }}
        />
        <Tabs.Screen
          name="entrepreneurs"
          options={{
            title: 'Red',
          }}
        />
      </Tabs>
    </View>
  );
}
