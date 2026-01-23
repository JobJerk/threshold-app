import { View, Text } from 'react-native'
import { Heart, ShoppingBag, Leaf, Cpu, Briefcase, GraduationCap, Home } from 'lucide-react-native'
import { Threshold } from '@/lib/supabase/types'

interface ThresholdCardProps {
  threshold: Threshold
}

const categoryConfig: Record<string, { color: string; icon: React.ComponentType<{ size: number; color: string }> }> = {
  Healthcare: { color: '#ef4444', icon: Heart },
  'Consumer Rights': { color: '#3b82f6', icon: ShoppingBag },
  Climate: { color: '#22c55e', icon: Leaf },
  Technology: { color: '#a855f7', icon: Cpu },
  Labor: { color: '#f97316', icon: Briefcase },
  Education: { color: '#06b6d4', icon: GraduationCap },
  Housing: { color: '#ec4899', icon: Home },
}

export function ThresholdCard({ threshold }: ThresholdCardProps) {
  const progress = (threshold.current_count / threshold.target_count) * 100
  const config = categoryConfig[threshold.category] || { color: '#666666', icon: Heart }
  const IconComponent = config.icon

  return (
    <View className="bg-card rounded-3xl p-6 mx-4 h-[420px] border border-border-default">
      <View
        className="self-start px-3 py-1.5 rounded-full flex-row items-center mb-4"
        style={{ backgroundColor: `${config.color}20` }}
      >
        <IconComponent size={14} color={config.color} />
        <Text className="text-sm font-medium ml-1.5" style={{ color: config.color }}>
          {threshold.category}
        </Text>
      </View>

      <Text className="text-2xl font-bold text-text-primary mb-3">{threshold.title}</Text>

      <Text className="text-text-secondary text-base leading-6 mb-6">{threshold.description}</Text>

      <View className="flex-1" />

      <View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-text-tertiary text-sm">Progress</Text>
          <Text className="text-text-primary font-semibold">
            {threshold.current_count.toLocaleString()} / {threshold.target_count.toLocaleString()}
          </Text>
        </View>
        <View className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
          <View
            className="h-full bg-accent rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </View>
        <Text className="text-center text-text-tertiary text-sm mt-2">
          {progress.toFixed(1)}% to threshold
        </Text>
      </View>

      <View className="flex-row justify-center mt-6 gap-8">
        <View className="items-center">
          <Text className="text-text-tertiary text-xl">{'<'} Pass</Text>
        </View>
        <View className="items-center">
          <Text className="text-accent text-xl font-semibold">Commit {'>'}</Text>
        </View>
      </View>
    </View>
  )
}
