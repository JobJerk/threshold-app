import { View, Text } from 'react-native'
import { Threshold } from '@/lib/supabase/types'

interface ThresholdCardProps {
  threshold: Threshold
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  Healthcare: { bg: 'bg-red-100', text: 'text-red-700' },
  'Consumer Rights': { bg: 'bg-blue-100', text: 'text-blue-700' },
  Climate: { bg: 'bg-green-100', text: 'text-green-700' },
  Technology: { bg: 'bg-purple-100', text: 'text-purple-700' },
  Labor: { bg: 'bg-orange-100', text: 'text-orange-700' },
}

export function ThresholdCard({ threshold }: ThresholdCardProps) {
  const progress = (threshold.current_count / threshold.target_count) * 100
  const colors = categoryColors[threshold.category] || { bg: 'bg-gray-100', text: 'text-gray-700' }

  return (
    <View className="bg-white rounded-3xl p-6 shadow-lg mx-4 h-[420px]">
      <View className={`self-start px-3 py-1 rounded-full ${colors.bg} mb-4`}>
        <Text className={`text-sm font-medium ${colors.text}`}>{threshold.category}</Text>
      </View>

      <Text className="text-2xl font-bold text-gray-900 mb-3">{threshold.title}</Text>

      <Text className="text-gray-600 text-base leading-6 mb-6">{threshold.description}</Text>

      <View className="flex-1" />

      <View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500 text-sm">Progress</Text>
          <Text className="text-gray-900 font-semibold">
            {threshold.current_count.toLocaleString()} / {threshold.target_count.toLocaleString()}
          </Text>
        </View>
        <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-indigo-600 rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </View>
        <Text className="text-center text-gray-500 text-sm mt-2">
          {progress.toFixed(1)}% to threshold
        </Text>
      </View>

      <View className="flex-row justify-center mt-6 gap-8">
        <View className="items-center">
          <Text className="text-gray-400 text-xl">{'<'} Pass</Text>
        </View>
        <View className="items-center">
          <Text className="text-indigo-600 text-xl font-semibold">Commit {'>'}</Text>
        </View>
      </View>
    </View>
  )
}
