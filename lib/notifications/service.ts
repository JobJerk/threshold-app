import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import { supabase } from '@/lib/supabase/client'

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export interface NotificationPermissionStatus {
  granted: boolean
  canAskAgain: boolean
}

/**
 * Request permission to send push notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (Platform.OS === 'web') {
    return { granted: false, canAskAgain: false }
  }

  if (!Device.isDevice) {
    console.warn('Push notifications only work on physical devices')
    return { granted: false, canAskAgain: false }
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()

  if (existingStatus === 'granted') {
    return { granted: true, canAskAgain: true }
  }

  const { status, canAskAgain } = await Notifications.requestPermissionsAsync()

  return {
    granted: status === 'granted',
    canAskAgain,
  }
}

/**
 * Get the push notification token
 */
export async function getPushToken(): Promise<string | null> {
  if (Platform.OS === 'web' || !Device.isDevice) {
    return null
  }

  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    })
    return token
  } catch (error) {
    console.error('Failed to get push token:', error)
    return null
  }
}

/**
 * Register push token with the backend
 */
export async function registerPushToken(
  userId: string,
  token: string
): Promise<void> {
  const platform = Platform.OS

  const { error } = await supabase.from('push_tokens').upsert(
    {
      user_id: userId,
      token,
      platform,
    } as never,
    {
      onConflict: 'user_id,token',
    }
  )

  if (error) {
    console.error('Failed to register push token:', error)
    throw error
  }
}

/**
 * Unregister push token from the backend
 */
export async function unregisterPushToken(
  userId: string,
  token: string
): Promise<void> {
  const { error } = await supabase
    .from('push_tokens')
    .delete()
    .eq('user_id', userId)
    .eq('token', token)

  if (error) {
    console.error('Failed to unregister push token:', error)
    throw error
  }
}

/**
 * Schedule a local notification for energy refill
 */
export async function scheduleEnergyRefillNotification(): Promise<void> {
  if (Platform.OS === 'web') return

  // Cancel any existing energy notifications
  await Notifications.cancelScheduledNotificationAsync('energy-refill')

  // Schedule for tomorrow at 8am
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(8, 0, 0, 0)

  await Notifications.scheduleNotificationAsync({
    identifier: 'energy-refill',
    content: {
      title: 'New futures ready.',
      body: 'The direction keeps changing.',
      data: { type: 'energy-refill' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: tomorrow,
    },
  })
}

/**
 * Schedule a daily reminder notification
 */
export async function scheduleDailyReminderNotification(): Promise<void> {
  if (Platform.OS === 'web') return

  // Cancel any existing reminders
  await Notifications.cancelScheduledNotificationAsync('daily-reminder')

  // Schedule for 6pm today or tomorrow
  const reminderTime = new Date()
  reminderTime.setHours(18, 0, 0, 0)

  // If it's past 6pm, schedule for tomorrow
  if (new Date() > reminderTime) {
    reminderTime.setDate(reminderTime.getDate() + 1)
  }

  await Notifications.scheduleNotificationAsync({
    identifier: 'daily-reminder',
    content: {
      title: 'The future keeps shifting.',
      body: 'New thresholds. New decisions.',
      data: { type: 'daily-reminder' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderTime,
    },
  })
}

/**
 * Initialize notification listeners
 * Returns cleanup function
 */
export function initializeNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void
): () => void {
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      onNotificationReceived?.(notification)
    }
  )

  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      onNotificationResponse?.(response)
    }
  )

  return () => {
    receivedSubscription.remove()
    responseSubscription.remove()
  }
}
