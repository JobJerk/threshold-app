import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Threshold } from '@/lib/supabase/types'
import { useAuth } from '@/contexts/AuthContext'

export function useThresholds() {
  const { user } = useAuth()

  return useQuery<Threshold[]>({
    queryKey: ['thresholds', user?.id],
    queryFn: async () => {
      // Get thresholds the user hasn't committed to yet
      const { data: commitments } = await supabase
        .from('commitments')
        .select('threshold_id')
        .eq('user_id', user?.id ?? '')

      const committedIds = commitments?.map((c) => c.threshold_id) ?? []

      let query = supabase
        .from('thresholds')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (committedIds.length > 0) {
        query = query.not('id', 'in', `(${committedIds.join(',')})`)
      }

      const { data, error } = await query

      if (error) throw error
      return data ?? []
    },
    enabled: !!user?.id,
  })
}
