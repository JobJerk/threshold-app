import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Badge } from '@/lib/supabase/types'
import { useAuth } from '@/contexts/AuthContext'

export interface BadgeWithStatus extends Badge {
  earned: boolean
  earned_at?: string
}

export function useBadges() {
  const { user } = useAuth()

  return useQuery<BadgeWithStatus[]>({
    queryKey: ['badges', user?.id],
    queryFn: async () => {
      // Get all badges
      const { data: badges, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .order('requirement_value', { ascending: true })

      if (badgesError) throw badgesError

      // Get user's earned badges
      const { data: userBadges, error: userBadgesError } = await supabase
        .from('user_badges')
        .select('badge_id, earned_at')
        .eq('user_id', user?.id ?? '')

      if (userBadgesError) throw userBadgesError

      const earnedMap = new Map(
        (userBadges as { badge_id: string; earned_at: string }[] | null)?.map((ub) => [
          ub.badge_id,
          ub.earned_at,
        ]) ?? []
      )

      return ((badges as Badge[] | null) ?? []).map((badge) => ({
        ...badge,
        earned: earnedMap.has(badge.id),
        earned_at: earnedMap.get(badge.id),
      }))
    },
    enabled: !!user?.id,
  })
}
