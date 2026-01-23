import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  requestNotificationPermission,
  getPushToken,
  registerPushToken,
  initializeNotificationListeners,
  scheduleDailyReminderNotification,
  NotificationPermissionStatus,
} from '@/lib/notifications/service'

export function useNotifications() {
  const { user } = useAuth()
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus | null>(null)
  const [pushToken, setPushToken] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)

  // Request permission and register token
  const registerForNotifications = useCallback(async () => {
    if (!user?.id || isRegistering) return

    setIsRegistering(true)

    try {
      // Request permission
      const status = await requestNotificationPermission()
      setPermissionStatus(status)

      if (!status.granted) {
        return
      }

      // Get push token
      const token = await getPushToken()
      if (!token) {
        return
      }

      setPushToken(token)

      // Register token with backend
      await registerPushToken(user.id, token)

      // Schedule daily reminder
      await scheduleDailyReminderNotification()
    } catch (error) {
      console.error('Failed to register for notifications:', error)
    } finally {
      setIsRegistering(false)
    }
  }, [user?.id, isRegistering])

  // Initialize notification listeners on mount
  useEffect(() => {
    const cleanup = initializeNotificationListeners(
      (notification) => {
        console.log('Notification received:', notification)
      },
      (response) => {
        console.log('Notification response:', response)
        // Handle notification tap - could navigate to specific screen
        const data = response.notification.request.content.data
        if (data?.type === 'daily-reminder' || data?.type === 'energy-refill') {
          // Could navigate to home screen
        }
      }
    )

    return cleanup
  }, [])

  // Auto-register when user is available
  useEffect(() => {
    if (user?.id && !pushToken && !isRegistering) {
      registerForNotifications()
    }
  }, [user?.id, pushToken, isRegistering, registerForNotifications])

  return {
    permissionStatus,
    pushToken,
    isRegistering,
    registerForNotifications,
    hasPermission: permissionStatus?.granted ?? false,
  }
}
