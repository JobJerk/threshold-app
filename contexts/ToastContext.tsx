import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { View } from 'react-native'
import { Toast, ToastData } from '@/components/ui/Toast'

interface ToastContextType {
  showToast: (toast: Omit<ToastData, 'id'>) => void
  showSuccess: (title: string, message?: string) => void
  showError: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showToast({ type: 'success', title, message })
    },
    [showToast]
  )

  const showError = useCallback(
    (title: string, message?: string) => {
      showToast({ type: 'error', title, message })
    },
    [showToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError }}>
      {children}
      {/* Toast container - fixed at top */}
      {toasts.length > 0 && (
        <View className="absolute top-20 left-4 right-4 z-50">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </View>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
