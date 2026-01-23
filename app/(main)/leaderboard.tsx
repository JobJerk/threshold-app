import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Trophy, Flame, Target, Medal } from 'lucide-react-native'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useAuth } from '@/contexts/AuthContext'
import { LeaderboardEntry } from '@/lib/supabase/types'

function LeaderboardItem({ item, isCurrentUser }: { item: LeaderboardEntry; isCurrentUser: boolean }) {
  const getRankDisplay = (rank: number) => {
    if (rank === 1) return { color: '#fbbf24', showMedal: true }
    if (rank === 2) return { color: '#9ca3af', showMedal: true }
    if (rank === 3) return { color: '#d97706', showMedal: true }
    return { color: '#666666', showMedal: false }
  }

  const rankDisplay = getRankDisplay(item.rank)

  return (
    <View
      className={`flex-row items-center px-4 py-3 mx-4 mb-2 rounded-xl border ${
        isCurrentUser ? 'bg-accent-muted border-accent' : 'bg-card border-border-default'
      }`}
    >
      <View className="w-12 items-center">
        {rankDisplay.showMedal ? (
          <Medal size={24} color={rankDisplay.color} />
        ) : (
          <Text className="text-lg font-bold text-text-tertiary">#{item.rank}</Text>
        )}
      </View>
      <View className="flex-1 ml-3">
        <Text className={`font-semibold ${isCurrentUser ? 'text-accent' : 'text-text-primary'}`}>
          {item.username || 'Anonymous'}
          {isCurrentUser && ' (You)'}
        </Text>
        <View className="flex-row items-center gap-3 mt-1">
          <View className="flex-row items-center">
            <Flame size={12} color="#666666" />
            <Text className="text-text-tertiary text-xs ml-1">{item.current_streak} streak</Text>
          </View>
          <View className="flex-row items-center">
            <Target size={12} color="#666666" />
            <Text className="text-text-tertiary text-xs ml-1">{item.total_commits} commits</Text>
          </View>
        </View>
      </View>
      <View className="items-end">
        <Text className={`font-bold text-lg ${isCurrentUser ? 'text-accent' : 'text-text-primary'}`}>
          {item.points.toLocaleString()}
        </Text>
        <Text className="text-text-tertiary text-xs">points</Text>
      </View>
    </View>
  )
}

export default function Leaderboard() {
  const { data: leaderboard, isLoading, error } = useLeaderboard()
  const { user } = useAuth()

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f59e0b" />
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-error text-center">Failed to load leaderboard</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 py-4 bg-bg-primary border-b border-border-default">
        <Text className="text-2xl font-bold text-text-primary">Leaderboard</Text>
        <Text className="text-text-secondary mt-1">Top activists this month</Text>
      </View>

      {!leaderboard || leaderboard.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Trophy size={64} color="#f59e0b" />
          <Text className="text-xl font-bold text-text-primary text-center mt-4">
            No one on the board yet
          </Text>
          <Text className="text-text-secondary text-center mt-2">
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
