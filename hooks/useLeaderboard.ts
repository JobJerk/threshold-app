import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { LeaderboardEntry } from '@/lib/supabase/types'

export function useLeaderboard() {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(100)

      if (error) throw error
      return (data as LeaderboardEntry[] | null) ?? []
    },
  })
}
