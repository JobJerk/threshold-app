import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { calculateCommitmentPoints, isEarlyCommit } from '@/lib/points/calculator'
import { Threshold } from '@/lib/supabase/types'

interface CommitParams {
  threshold: Threshold
}

export function useCommitment() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ threshold }: CommitParams) => {
      if (!user?.id) throw new Error('User not authenticated')

      const earlyCommit = isEarlyCommit(threshold.current_count, threshold.target_count)
      const points = calculateCommitmentPoints({ isEarlyCommit: earlyCommit })

      // Insert commitment
      const { error: commitError } = await supabase.from('commitments').insert({
        user_id: user.id,
        threshold_id: threshold.id,
        points_earned: points,
      })

      if (commitError) throw commitError

      // Increment user points
      const { error: pointsError } = await supabase.rpc('increment_points', {
        user_id: user.id,
        amount: points,
      })

      if (pointsError) throw pointsError

      // Increment threshold count
      const { error: countError } = await supabase.rpc('increment_threshold_count', {
        threshold_id: threshold.id,
      })

      if (countError) throw countError

      return { points }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thresholds'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
