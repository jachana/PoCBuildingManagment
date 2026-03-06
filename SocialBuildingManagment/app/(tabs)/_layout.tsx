import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { NetworkStatus } from '@/components/NetworkStatus';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <NetworkStatus />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#999',
          headerShown: true,
        }}
      >
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Marketplace',
          headerTitle: 'Marketplace',
        }}
      />
      <Tabs.Screen
        name="recommendations"
        options={{
          title: 'Servicios',
          headerTitle: 'Recomendaciones',
        }}
      />
      <Tabs.Screen
        name="entrepreneurs"
        options={{
          title: 'Emprendedores',
          headerTitle: 'Emprendedores',
        }}
      />
      </Tabs>
    </View>
  );
}
