import { View, Text, Pressable } from 'react-native'
import { User, Zap } from 'lucide-react-native'
import { useProfile } from '@/hooks/useProfile'
import { useRouter } from 'expo-router'
import { EnergyDisplay } from './EnergyDisplay'

export function Header() {
  const { data: profile } = useProfile()
  const router = useRouter()

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-bg-primary border-b border-border-default">
      <Text className="text-xl font-bold text-text-primary">Threshold</Text>
      <View className="flex-row items-center gap-3">
        <EnergyDisplay />
        <View className="bg-accent-muted px-3 py-1.5 rounded-full flex-row items-center">
          <Zap size={14} color="#f59e0b" fill="#f59e0b" />
          <Text className="text-accent font-semibold ml-1">{profile?.points ?? 0}</Text>
        </View>
        <Pressable onPress={() => router.push('/(main)/profile')}>
          <View className="w-8 h-8 bg-bg-tertiary rounded-full items-center justify-center">
            <User size={16} color="#a3a3a3" />
          </View>
        </Pressable>
      </View>
    </View>
  )
}
