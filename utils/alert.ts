import { Alert, Platform } from 'react-native'

interface AlertButton {
  text: string
  onPress?: () => void
}

/**
 * Cross-platform alert that works on both mobile and web
 */
export function showAlert(
  title: string,
  message?: string,
  buttons?: AlertButton[]
): void {
  if (Platform.OS === 'web') {
    // On web, use browser's native alert or confirm
    const fullMessage = message ? `${title}\n\n${message}` : title

    if (buttons && buttons.length > 1) {
      // Use confirm for multiple buttons
      const confirmed = window.confirm(fullMessage)
      if (confirmed && buttons[1]?.onPress) {
        buttons[1].onPress()
      } else if (!confirmed && buttons[0]?.onPress) {
        buttons[0].onPress()
      }
    } else {
      // Simple alert
      window.alert(fullMessage)
      if (buttons?.[0]?.onPress) {
        buttons[0].onPress()
      }
    }
  } else {
    // On mobile, use React Native's Alert
    Alert.alert(title, message, buttons)
  }
}
