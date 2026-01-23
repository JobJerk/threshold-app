import { useState } from 'react'
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { User, Zap, Award, Lock, LogOut, ChevronDown, ChevronUp } from 'lucide-react-native'
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

function RankItem({ badge }: { badge: BadgeWithStatus }) {
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
    </View>
  )
}

export default function Profile() {
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: badges, isLoading: badgesLoading } = useBadges()
  const { signOut, user } = useAuth()
  const [whyExpanded, setWhyExpanded] = useState(false)

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
          <StatCard label="Force" value={profile?.points ?? 0} icon={Zap} />
          <StatCard label="Ranks" value={earnedBadges.length} icon={Award} />
        </View>

        {/* Earned Ranks */}
        {earnedBadges.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-text-primary px-4 mb-3">
              Earned Ranks ({earnedBadges.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
              {earnedBadges.map((badge) => (
                <RankItem key={badge.id} badge={badge} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Locked Ranks */}
        {unearnedBadges.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-text-primary px-4 mb-3">
              Locked Ranks ({unearnedBadges.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
              {unearnedBadges.map((badge) => (
                <RankItem key={badge.id} badge={badge} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Why We're Here */}
        <View className="mx-4 mb-4">
          <Pressable
            onPress={() => setWhyExpanded(!whyExpanded)}
            className="bg-card rounded-xl p-4 border border-border-default"
          >
            <View className="flex-row items-center justify-between">
              <Text className="font-bold text-text-primary text-lg">Why We're Here</Text>
              {whyExpanded ? (
                <ChevronUp size={20} color="#a3a3a3" />
              ) : (
                <ChevronDown size={20} color="#a3a3a3" />
              )}
            </View>

            {whyExpanded && (
              <View className="mt-4">
                <Text className="text-text-secondary leading-6 mb-4">
                  There's a weight most of us carry — that the big problems aren't ours to solve.
                </Text>

                <Text className="text-text-secondary leading-6 mb-4">
                  We're tired. Worn out. Misdirected by so many problems we don't know where to begin.
                </Text>

                <Text className="text-text-secondary leading-6 mb-4">
                  We feel like we can't take on large entities because they have so much money. We can't change the government. We can't solve certain technical problems because there's too much constraint around them.
                </Text>

                <Text className="text-text-secondary leading-6 mb-4">
                  These were the same feelings before we went to the moon.
                </Text>

                <Text className="text-text-secondary leading-6 mb-4">
                  But by combining many patterns and many skills across many industries — by focusing — we did what seemed impossible.
                </Text>

                <Text className="text-text-secondary leading-6 mb-4">
                  Today, the technological evolutions in our hands, especially in information technology, in AI, in our ability to coordinate — these have yet to yield the magnitude of impact that could possibly come out of them. Part of this is because of greed. Part of this is because of direction. Part of this is because there are so many problems we don't even know where to begin.
                </Text>

                <Text className="text-text-primary leading-6 mb-4 font-semibold">
                  This app is about focusing.
                </Text>

                <Text className="text-text-secondary leading-6 mb-4">
                  It's about finding the problems that are worth solving, coordinating, agreeing, actually grabbing a metric around when they'll be feasible — and coordinating that with those who could build. Those who can compete to build.
                </Text>

                <Text className="text-text-secondary leading-6 mb-1">
                  This app is a vision. It's a test.
                </Text>

                <Text className="text-accent leading-6 mb-4 font-semibold">
                  Is now the time? Is this worth it?
                </Text>

                <Text className="text-text-secondary leading-6 mb-4">
                  What you're doing here is not just fun. It's not just interesting. It doesn't just get your mind thinking and breaking down constraints. These are not just cards — they are ideas created by experts and groups of people across industries, ideas that are executable, purposely crafted to get you out of the box.
                </Text>

                <Text className="text-text-primary leading-6 mb-4 font-medium">
                  Every time you swipe, every time you make a commitment, every time you give an insight or add something — you are crafting the future.
                </Text>

                <Text className="text-text-secondary leading-6 mb-4">
                  You don't need the majority to capture and change the direction of an entire community.
                </Text>

                <Text className="text-text-secondary leading-6 mb-4">
                  Our goal is to change the direction of the entire globe. Our goal is to change the direction of every industry. Our goal is to change how we approach responding to problems, because the current ways don't work.
                </Text>

                <Text className="text-text-secondary leading-6 mb-4">
                  This is not for those waiting for someone else, telling us it will correct itself.
                </Text>

                <Text className="text-text-secondary leading-6">
                  This process, this community, this venture, this vision — it is for those who are seeking what is next. Not those seeking something slightly better. Something entirely new. Something so much better, so far beyond where we're at today, that nothing else will do.
                </Text>
              </View>
            )}
          </Pressable>
        </View>

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
