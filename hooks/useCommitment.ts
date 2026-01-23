import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { calculateCommitmentPoints, isEarlyCommit } from '@/lib/points/calculator'
import { Threshold } from '@/lib/supabase/types'

interface CommitParams {
  threshold: Threshold
}

interface CommitResult {
  points: number
  newBadges: { badge_name: string; badge_icon: string }[]
}

interface CommitResponse {
  commitment_id: string
  points: number
  new_badges: { badge_name: string; badge_icon: string }[] | null
}

export function useCommitment() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation<CommitResult, Error, CommitParams>({
    mutationFn: async ({ threshold }) => {
      if (!user?.id) throw new Error('User not authenticated')

      const earlyCommit = isEarlyCommit(threshold.current_count, threshold.target_count)
      const points = calculateCommitmentPoints({ isEarlyCommit: earlyCommit })

      // Use atomic commit function that handles everything in one transaction
      const { data, error } = await supabase.rpc('commit_to_threshold', {
        p_user_id: user.id,
        p_threshold_id: threshold.id,
        p_points: points,
      } as never)

      if (error) {
        if (error.message.includes('Insufficient energy')) {
          throw new Error('Not enough energy to commit')
        }
        throw new Error(error.message)
      }

      const result = data as CommitResponse

      return {
        points: result.points,
        newBadges: result.new_badges ?? [],
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thresholds'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['energy'] })
      queryClient.invalidateQueries({ queryKey: ['badges'] })
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
      queryClient.invalidateQueries({ queryKey: ['commitments'] })
    },
  })
}
