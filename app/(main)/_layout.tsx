import { Tabs } from 'expo-router'
import { View, Text } from 'react-native'

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f3f4f6',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <View>
              <Text style={{ fontSize: 24, color }}>🏠</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => (
            <View>
              <Text style={{ fontSize: 24, color }}>🏆</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <View>
              <Text style={{ fontSize: 24, color }}>👤</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  )
}
