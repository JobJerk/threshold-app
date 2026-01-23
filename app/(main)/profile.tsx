import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { User, Zap, Flame, Award, Lock, LogOut } from 'lucide-react-native'
import { useProfile } from '@/hooks/useProfile'
import { useBadges, BadgeWithStatus } from '@/hooks/useBadges'
import { useAuth } from '@/contexts/AuthContext'

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ size: number; color: string }>
}) {
  return (
    <View className="bg-card rounded-xl p-4 flex-1 items-center border border-border-default">
      <Icon size={24} color="#f59e0b" />
      <Text className="text-2xl font-bold text-text-primary mt-2">{value}</Text>
      <Text className="text-text-secondary text-sm">{label}</Text>
    </View>
  )
}

function BadgeItem({ badge }: { badge: BadgeWithStatus }) {
  return (
    <View
      className={`items-center p-3 rounded-xl mr-3 w-20 border ${
        badge.earned ? 'bg-card border-border-hover' : 'bg-bg-secondary border-border-default opacity-50'
      }`}
    >
      {badge.earned ? (
        <Award size={28} color="#f59e0b" />
      ) : (
        <Lock size={28} color="#666666" />
      )}
      <Text className="text-xs text-center text-text-secondary font-medium mt-1" numberOfLines={2}>
        {badge.name}
      </Text>
      {badge.earned && <Text className="text-xs text-success mt-1">Earned</Text>}
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
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f59e0b" />
        </View>
      </SafeAreaView>
    )
  }

  const earnedBadges = badges?.filter((b) => b.earned) ?? []
  const unearnedBadges = badges?.filter((b) => !b.earned) ?? []

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-4 bg-bg-primary border-b border-border-default">
          <Text className="text-2xl font-bold text-text-primary">Profile</Text>
        </View>

        {/* User Info */}
        <View className="items-center py-6 bg-bg-primary">
          <View className="w-20 h-20 bg-bg-tertiary rounded-full items-center justify-center mb-3">
            <User size={40} color="#a3a3a3" />
          </View>
          <Text className="text-xl font-bold text-text-primary">
            {profile?.username || user?.email?.split('@')[0] || 'Anonymous'}
          </Text>
          <Text className="text-text-secondary">{user?.email}</Text>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 px-4 py-4">
          <StatCard label="Points" value={profile?.points ?? 0} icon={Zap} />
          <StatCard label="Streak" value={profile?.current_streak ?? 0} icon={Flame} />
          <StatCard label="Badges" value={earnedBadges.length} icon={Award} />
        </View>

        {/* Streak Info */}
        <View className="mx-4 bg-card rounded-xl p-4 mb-4 border border-border-default">
          <Text className="font-bold text-text-primary mb-3">Streak Stats</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-text-secondary text-sm">Current Streak</Text>
              <Text className="text-xl font-bold text-accent">
                {profile?.current_streak ?? 0} days
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-text-secondary text-sm">Longest Streak</Text>
              <Text className="text-xl font-bold text-text-primary">
                {profile?.longest_streak ?? 0} days
              </Text>
            </View>
          </View>
        </View>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-text-primary px-4 mb-3">
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
            <Text className="text-lg font-bold text-text-primary px-4 mb-3">
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
            className="bg-bg-tertiary py-4 rounded-xl active:bg-border-default flex-row items-center justify-center"
          >
            <LogOut size={18} color="#a3a3a3" />
            <Text className="text-text-secondary text-center font-semibold ml-2">Sign Out</Text>
          </Pressable>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  )
}
