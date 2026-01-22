import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'
import { Database } from './types'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

// Create a storage adapter that works for web SSR, web client, and native
const createStorage = () => {
  if (Platform.OS === 'web') {
    // Web: use localStorage if available (client-side), or a no-op for SSR
    if (typeof window !== 'undefined' && window.localStorage) {
      return {
        getItem: (key: string) => window.localStorage.getItem(key),
        setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
        removeItem: (key: string) => window.localStorage.removeItem(key),
      }
    }
    // SSR: return no-op storage
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  }
  // Native: use AsyncStorage
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const AsyncStorage = require('@react-native-async-storage/async-storage').default
  return AsyncStorage
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
})
