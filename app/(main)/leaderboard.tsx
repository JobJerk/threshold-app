import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useAuth } from '@/contexts/AuthContext'
import { LeaderboardEntry } from '@/lib/supabase/types'

function LeaderboardItem({ item, isCurrentUser }: { item: LeaderboardEntry; isCurrentUser: boolean }) {
  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <View
      className={`flex-row items-center px-4 py-3 mx-4 mb-2 rounded-xl ${
        isCurrentUser ? 'bg-indigo-50 border border-indigo-200' : 'bg-white'
      }`}
    >
      <View className="w-12 items-center">
        <Text className={`text-lg font-bold ${item.rank <= 3 ? 'text-2xl' : 'text-gray-500'}`}>
          {getRankEmoji(item.rank)}
        </Text>
      </View>
      <View className="flex-1 ml-3">
        <Text className={`font-semibold ${isCurrentUser ? 'text-indigo-700' : 'text-gray-900'}`}>
          {item.username || 'Anonymous'}
          {isCurrentUser && ' (You)'}
        </Text>
        <View className="flex-row items-center gap-3 mt-1">
          <Text className="text-gray-500 text-xs">🔥 {item.current_streak} streak</Text>
          <Text className="text-gray-500 text-xs">✊ {item.total_commits} commits</Text>
        </View>
      </View>
      <View className="items-end">
        <Text className={`font-bold text-lg ${isCurrentUser ? 'text-indigo-600' : 'text-gray-900'}`}>
          {item.points.toLocaleString()}
        </Text>
        <Text className="text-gray-500 text-xs">points</Text>
      </View>
    </View>
  )
}

export default function Leaderboard() {
  const { data: leaderboard, isLoading, error } = useLeaderboard()
  const { user } = useAuth()

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-red-500 text-center">Failed to load leaderboard</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Leaderboard</Text>
        <Text className="text-gray-500 mt-1">Top activists this month</Text>
      </View>

      {!leaderboard || leaderboard.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">🏆</Text>
          <Text className="text-xl font-bold text-gray-900 text-center">No one on the board yet</Text>
          <Text className="text-gray-500 text-center mt-2">
            Be the first to commit and claim the top spot!
          </Text>
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <LeaderboardItem item={item} isCurrentUser={item.id === user?.id} />
          )}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}
