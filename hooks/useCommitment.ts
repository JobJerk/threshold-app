import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { calculateCommitmentPoints, isEarlyCommit } from '@/lib/points/calculator'
import { consumeEnergy, ENERGY_PER_COMMIT } from '@/lib/energy/manager'
import { Threshold } from '@/lib/supabase/types'

interface CommitParams {
  threshold: Threshold
}

interface CommitResult {
  points: number
  newBadges: { badge_name: string; badge_icon: string }[]
}

export function useCommitment() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation<CommitResult, Error, CommitParams>({
    mutationFn: async ({ threshold }) => {
      if (!user?.id) throw new Error('User not authenticated')

      // Consume energy first (atomic operation, will throw if insufficient)
      await consumeEnergy(user.id, ENERGY_PER_COMMIT)

      const earlyCommit = isEarlyCommit(threshold.current_count, threshold.target_count)
      const points = calculateCommitmentPoints({ isEarlyCommit: earlyCommit })

      // Insert commitment
      const { error: commitError } = await supabase.from('commitments').insert({
        user_id: user.id,
        threshold_id: threshold.id,
        points_earned: points,
      } as never)

      if (commitError) throw commitError

      // Increment user points
      const { error: pointsError } = await supabase.rpc('increment_points', {
        user_id: user.id,
        amount: points,
      } as never)

      if (pointsError) throw pointsError

      // Increment threshold count
      const { error: countError } = await supabase.rpc('increment_threshold_count', {
        threshold_id: threshold.id,
      } as never)

      if (countError) throw countError

      // Update user streak
      const { error: streakError } = await supabase.rpc('update_user_streak', {
        p_user_id: user.id,
      } as never)

      if (streakError) console.warn('Failed to update streak:', streakError)

      // Check and award badges
      const { data: newBadges, error: badgeError } = await supabase.rpc('check_and_award_badges', {
        p_user_id: user.id,
      } as never)

      if (badgeError) console.warn('Failed to check badges:', badgeError)

      return {
        points,
        newBadges: (newBadges as { badge_name: string; badge_icon: string }[] | null) ?? [],
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thresholds'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['badges'] })
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
      queryClient.invalidateQueries({ queryKey: ['commitments'] })
    },
  })
}
