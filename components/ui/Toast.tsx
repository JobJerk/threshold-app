import { useEffect, useState } from 'react'
import { View, Text, Pressable, Animated } from 'react-native'
import { X } from 'lucide-react-native'

export interface ToastData {
  id: string
  title: string
  message?: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

interface ToastProps {
  toast: ToastData
  onDismiss: (id: string) => void
}

const TOAST_COLORS = {
  success: {
    bg: 'bg-green-500/20',
    border: 'border-green-500',
    text: 'text-green-400',
  },
  error: {
    bg: 'bg-red-500/20',
    border: 'border-red-500',
    text: 'text-red-400',
  },
  info: {
    bg: 'bg-amber-500/20',
    border: 'border-amber-500',
    text: 'text-amber-400',
  },
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const [fadeAnim] = useState(() => new Animated.Value(0))
  const colors = TOAST_COLORS[toast.type]
  const duration = toast.duration || 4000

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start()

    // Auto dismiss
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => onDismiss(toast.id))
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, fadeAnim, onDismiss, toast.id])

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View
        className={`${colors.bg} ${colors.border} border rounded-xl p-4 mb-2 flex-row items-start`}
      >
        <View className="flex-1">
          <Text className={`${colors.text} font-bold text-base`}>{toast.title}</Text>
          {toast.message && (
            <Text className="text-text-secondary text-sm mt-1">{toast.message}</Text>
          )}
        </View>
        <Pressable onPress={() => onDismiss(toast.id)} className="ml-2">
          <X size={18} color="#666" />
        </Pressable>
      </View>
    </Animated.View>
  )
}
