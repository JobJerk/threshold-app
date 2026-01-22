import { View, Text, Pressable } from 'react-native'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const { data: profile } = useProfile()
  const { signOut } = useAuth()

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <Text className="text-xl font-bold text-gray-900">Threshold</Text>
      <View className="flex-row items-center gap-4">
        <View className="bg-indigo-100 px-3 py-1 rounded-full flex-row items-center">
          <Text className="text-indigo-600 font-semibold">{profile?.points ?? 0}</Text>
          <Text className="text-indigo-600 ml-1">pts</Text>
        </View>
        <Pressable onPress={signOut}>
          <View className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center">
            <Text className="text-gray-600 text-sm">👤</Text>
          </View>
        </Pressable>
      </View>
    </View>
  )
}
