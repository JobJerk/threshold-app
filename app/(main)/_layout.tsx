import { useEffect } from 'react'
import { Tabs, useRouter } from 'expo-router'
import { Home, Trophy, User } from 'lucide-react-native'
import { useAuth } from '@/contexts/AuthContext'

export default function MainLayout() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect to welcome if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/(auth)/welcome')
    }
  }, [user, loading])

  // Don't render tabs until we confirm user is authenticated
  if (loading || !user) {
    return null
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderTopColor: '#222222',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#f59e0b',
        tabBarInactiveTintColor: '#666666',
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
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
