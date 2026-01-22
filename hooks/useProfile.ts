import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Profile } from '@/lib/supabase/types'
import { useAuth } from '@/contexts/AuthContext'

export function useProfile() {
  const { user } = useAuth()

  return useQuery<Profile | null>({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!user?.id,
  })
}
