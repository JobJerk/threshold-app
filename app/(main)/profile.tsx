import { useState } from 'react'
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { User, Zap, Award, Lock, LogOut, ChevronDown, ChevronUp, FileText, Check, Clock } from 'lucide-react-native'
import { useProfile } from '@/hooks/useProfile'
import { useBadges, BadgeWithStatus } from '@/hooks/useBadges'
import { useCommitments, Commitment } from '@/hooks/useCommitments'
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

function CommitmentItem({ commitment }: { commitment: Commitment }) {
  const threshold = commitment.threshold
  const isAchieved = threshold && threshold.current_count >= threshold.target_count
  const progress = threshold ? Math.min((threshold.current_count / threshold.target_count) * 100, 100) : 0

  const committedDate = new Date(commitment.committed_at)
  const dateStr = committedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })

  return (
    <View className="bg-card rounded-xl p-4 mb-3 border border-border-default mx-4">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-text-primary font-semibold" numberOfLines={2}>
            {threshold?.title || 'Unknown Threshold'}
          </Text>
          <Text className="text-text-secondary text-xs mt-1">
            {threshold?.category || 'Unknown'}
          </Text>
        </View>
        <View className="items-end">
          <View className="flex-row items-center">
            {isAchieved ? (
              <Check size={14} color="#22c55e" />
            ) : (
              <Clock size={14} color="#f59e0b" />
            )}
            <Text className={`text-xs ml-1 ${isAchieved ? 'text-success' : 'text-accent'}`}>
              {isAchieved ? 'Achieved' : 'Pending'}
            </Text>
          </View>
          <Text className="text-text-secondary text-xs mt-1">{dateStr}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden mb-2">
        <View
          className={`h-full rounded-full ${isAchieved ? 'bg-success' : 'bg-accent'}`}
          style={{ width: `${progress}%` }}
        />
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-text-secondary text-xs">
          {threshold?.current_count?.toLocaleString() || 0} / {threshold?.target_count?.toLocaleString() || 0}
        </Text>
        <Text className="text-accent text-xs font-semibold">
          +{commitment.points_earned} force
        </Text>
      </View>
    </View>
  )
}

function WhyWeAreHere() {
  const [expanded, setExpanded] = useState(false)

  return (
    <View className="mx-4 mb-4">
      <Pressable
        onPress={() => setExpanded(!expanded)}
        className="bg-card rounded-xl p-4 border border-border-default"
      >
        <View className="flex-row items-center justify-center">
          <Text className="font-bold text-text-primary">Why We're Here</Text>
          <View className="absolute right-0">
            {expanded ? (
              <ChevronUp size={20} color="#a3a3a3" />
            ) : (
              <ChevronDown size={20} color="#a3a3a3" />
            )}
          </View>
        </View>

        {expanded && (
          <View className="mt-6 px-4">
            <Text className="text-text-secondary leading-7 mb-6 text-center">
              There's a weight most of us carry — that the big problems aren't ours to solve.
            </Text>

            <Text className="text-text-secondary leading-7 mb-6 text-center">
              We're tired. Worn out. Misdirected by so many problems we don't know where to begin.
            </Text>

            <Text className="text-text-secondary leading-7 mb-6 text-center">
              We feel like we can't take on large entities because they have so much money. We can't change the government. We can't solve certain technical problems because there's too much constraint around them.
            </Text>

            <Text className="text-text-secondary leading-7 mb-6 text-center">
              These were the same feelings before we went to the moon.
            </Text>

            <Text className="text-text-secondary leading-7 mb-6 text-center">
              But by combining many patterns and many skills across many industries — by focusing — we did what seemed impossible.
            </Text>

            <Text className="text-text-secondary leading-7 mb-6 text-center">
              Today, the technological evolutions in our hands, especially in information technology, in AI, in our ability to coordinate — these have yet to yield the magnitude of impact that could possibly come out of them. Part of this is because of greed. Part of this is because of direction. Part of this is because there are so many problems we don't even know where to begin.
            </Text>

            <Text className="text-text-primary leading-8 mb-8 text-center text-lg font-medium">
              This app is about focusing.
            </Text>

            <Text className="text-text-secondary leading-7 mb-6 text-center">
              It's about finding the problems that are worth solving, coordinating, agreeing, actually grabbing a metric around when they'll be feasible — and coordinating that with those who could build. Those who can compete to build.
            </Text>

            <Text className="text-text-secondary leading-7 mb-6 text-center">
              This app is a vision. It's a test.
            </Text>

            <Text className="text-accent leading-8 mb-8 text-center text-lg font-semibold">
              Is now the time? Is this worth it?
            </Text>

            <Text className="text-text-secondary leading-7 mb-6 text-center">
              What you're doing here is not just fun. It's not just interesting. It doesn't just get your mind thinking and breaking down constraints. These are not just cards — they are ideas created by experts and groups of people across industries, ideas that are executable, purposely crafted to get you out of the box.
            </Text>

            <Text className="text-text-primary leading-8 mb-8 text-center text-lg font-medium">
              Every time you swipe, every time you make a commitment, every time you give an insight or add something — you are crafting the future.
            </Text>

            <Text className="text-text-secondary leading-7 mb-6 text-center">
              You don't need the majority to capture and change the direction of an entire community.
            </Text>

            <Text className="text-text-secondary leading-7 mb-6 text-center">
              Our goal is to change the direction of the entire globe. Our goal is to change the direction of every industry. Our goal is to change how we approach responding to problems, because the current ways don't work.
            </Text>

            <Text className="text-text-secondary leading-7 mb-6 text-center">
              This is not for those waiting for someone else, telling us it will correct itself.
            </Text>

            <Text className="text-text-secondary leading-7 text-center">
              This process, this community, this venture, this vision — it is for those who are seeking what is next. Not those seeking something slightly better. Something entirely new. Something so much better, so far beyond where we're at today, that nothing else will do.
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  )
}

export default function Profile() {
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: badges, isLoading: badgesLoading } = useBadges()
  const { data: commitments, isLoading: commitmentsLoading } = useCommitments()
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

  const earnedRanks = badges?.filter((b) => b.earned) ?? []
  const unearnedRanks = badges?.filter((b) => !b.earned) ?? []

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
          <StatCard label="Ranks" value={earnedRanks.length} icon={Award} />
        </View>

        {/* My Commitments */}
        <View className="mb-4">
          <View className="flex-row items-center px-4 mb-3">
            <FileText size={20} color="#f59e0b" />
            <Text className="text-lg font-bold text-text-primary ml-2">
              My Commitments
            </Text>
            {commitments && commitments.length > 0 && (
              <Text className="text-text-secondary ml-2">({commitments.length})</Text>
            )}
          </View>

          {commitmentsLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="small" color="#f59e0b" />
            </View>
          ) : commitments && commitments.length > 0 ? (
            commitments.map((commitment) => (
              <CommitmentItem key={commitment.id} commitment={commitment} />
            ))
          ) : (
            <View className="mx-4 bg-card rounded-xl p-6 border border-border-default items-center">
              <Text className="text-text-secondary text-center">
                No commitments yet.
              </Text>
              <Text className="text-text-secondary text-center text-sm mt-1">
                Swipe right on thresholds to commit.
              </Text>
            </View>
          )}
        </View>

        {/* Why We're Here */}
        <WhyWeAreHere />

        {/* Earned Ranks */}
        {earnedRanks.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-text-primary px-4 mb-3">
              Ranks ({earnedRanks.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
              {earnedRanks.map((badge) => (
                <RankItem key={badge.id} badge={badge} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Locked Ranks */}
        {unearnedRanks.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-text-primary px-4 mb-3">
              Locked Ranks ({unearnedRanks.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
              {unearnedRanks.map((badge) => (
                <RankItem key={badge.id} badge={badge} />
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
