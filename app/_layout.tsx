import '../global.css'

import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { useNotifications } from '@/hooks/useNotifications'

const queryClient = new QueryClient()

function NotificationInitializer({ children }: { children: React.ReactNode }) {
  // This hook handles notification registration automatically
  useNotifications()
  return <>{children}</>
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <NotificationInitializer>
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false }} />
            </NotificationInitializer>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
