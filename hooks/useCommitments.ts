import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export interface Commitment {
  id: string
  threshold_id: string
  points_earned: number
  committed_at: string
  threshold: {
    id: string
    title: string
    category: string
    current_count: number
    target_count: number
  }
}

export function useCommitments() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['commitments', user?.id],
    queryFn: async () => {
      if (!user?.id) return []

      const { data, error } = await supabase
        .from('commitments')
        .select(`
          id,
          threshold_id,
          points_earned,
          committed_at,
          threshold:thresholds (
            id,
            title,
            category,
            current_count,
            target_count
          )
        `)
        .eq('user_id', user.id)
        .order('committed_at', { ascending: false })

      if (error) throw error

      // Transform the data to flatten the threshold object
      // Supabase returns relations as arrays, so we need to extract the first item
      return (data || []).map((item: Record<string, unknown>) => ({
        id: item.id as string,
        threshold_id: item.threshold_id as string,
        points_earned: item.points_earned as number,
        committed_at: item.committed_at as string,
        threshold: Array.isArray(item.threshold) ? item.threshold[0] : item.threshold,
      })) as Commitment[]
    },
    enabled: !!user?.id,
  })
}
