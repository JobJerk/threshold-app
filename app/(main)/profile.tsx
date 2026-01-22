import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useProfile } from '@/hooks/useProfile'
import { useBadges, BadgeWithStatus } from '@/hooks/useBadges'
import { useAuth } from '@/contexts/AuthContext'

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <View className="bg-white rounded-xl p-4 flex-1 items-center">
      <Text className="text-2xl mb-1">{icon}</Text>
      <Text className="text-2xl font-bold text-gray-900">{value}</Text>
      <Text className="text-gray-500 text-sm">{label}</Text>
    </View>
  )
}

function BadgeItem({ badge }: { badge: BadgeWithStatus }) {
  return (
    <View
      className={`items-center p-3 rounded-xl mr-3 w-20 ${
        badge.earned ? 'bg-white' : 'bg-gray-100 opacity-50'
      }`}
    >
      <Text className="text-3xl mb-1">{badge.icon}</Text>
      <Text className="text-xs text-center text-gray-700 font-medium" numberOfLines={2}>
        {badge.name}
      </Text>
      {badge.earned && <Text className="text-xs text-green-600 mt-1">Earned</Text>}
    </View>
  )
}

export default function Profile() {
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: badges, isLoading: badgesLoading } = useBadges()
  const { signOut, user } = useAuth()

  const isLoading = profileLoading || badgesLoading

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </SafeAreaView>
    )
  }

  const earnedBadges = badges?.filter((b) => b.earned) ?? []
  const unearnedBadges = badges?.filter((b) => !b.earned) ?? []

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-4 bg-white border-b border-gray-100">
          <Text className="text-2xl font-bold text-gray-900">Profile</Text>
        </View>

        {/* User Info */}
        <View className="items-center py-6 bg-white">
          <View className="w-20 h-20 bg-indigo-100 rounded-full items-center justify-center mb-3">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-xl font-bold text-gray-900">
            {profile?.username || user?.email?.split('@')[0] || 'Anonymous'}
          </Text>
          <Text className="text-gray-500">{user?.email}</Text>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 px-4 py-4">
          <StatCard label="Points" value={profile?.points ?? 0} icon="⭐" />
          <StatCard label="Streak" value={profile?.current_streak ?? 0} icon="🔥" />
          <StatCard label="Badges" value={earnedBadges.length} icon="🏅" />
        </View>

        {/* Streak Info */}
        <View className="mx-4 bg-white rounded-xl p-4 mb-4">
          <Text className="font-bold text-gray-900 mb-2">Streak Stats</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-gray-500 text-sm">Current Streak</Text>
              <Text className="text-xl font-bold text-indigo-600">
                {profile?.current_streak ?? 0} days
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-500 text-sm">Longest Streak</Text>
              <Text className="text-xl font-bold text-gray-900">
                {profile?.longest_streak ?? 0} days
              </Text>
            </View>
          </View>
        </View>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-gray-900 px-4 mb-3">
              Earned Badges ({earnedBadges.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
              {earnedBadges.map((badge) => (
                <BadgeItem key={badge.id} badge={badge} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Locked Badges */}
        {unearnedBadges.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-gray-900 px-4 mb-3">
              Locked Badges ({unearnedBadges.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
              {unearnedBadges.map((badge) => (
                <BadgeItem key={badge.id} badge={badge} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Sign Out */}
        <View className="px-4 py-6">
          <Pressable
            onPress={signOut}
            className="bg-gray-200 py-4 rounded-xl active:bg-gray-300"
          >
            <Text className="text-gray-700 text-center font-semibold">Sign Out</Text>
          </Pressable>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  )
}
