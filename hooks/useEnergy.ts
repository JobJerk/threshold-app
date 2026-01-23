import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'
import {
  MAX_ENERGY,
  ENERGY_PER_COMMIT,
  hasEnoughEnergy,
  consumeEnergy,
  getTimeUntilNextEnergy,
} from '@/lib/energy/manager'

export function useEnergy() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch energy from server using RPC function that handles refills
  const { data: serverEnergy } = useQuery({
    queryKey: ['energy', user?.id],
    queryFn: async () => {
      if (!user?.id) return MAX_ENERGY

      const { data, error } = await supabase.rpc('get_energy_with_refill', {
        p_user_id: user.id,
      } as never)

      if (error) {
        console.warn('Failed to fetch energy:', error)
        return MAX_ENERGY
      }

      return data as number
    },
    enabled: !!user?.id,
    staleTime: 0, // Always refetch to get latest value
  })

  const currentEnergy = serverEnergy ?? MAX_ENERGY
  const canCommit = hasEnoughEnergy(currentEnergy)

  // For timeUntilNext, we use a simple approximation since we don't have last_reset
  // from the server. The next refill is either at the top of the next hour or midnight.
  const timeUntilNext = currentEnergy < MAX_ENERGY
    ? getTimeUntilNextEnergy(currentEnergy, new Date())
    : null

  const consumeEnergyMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')
      await consumeEnergy(user.id, ENERGY_PER_COMMIT)
    },
    onSuccess: () => {
      // Invalidate energy query to refetch from server
      queryClient.invalidateQueries({ queryKey: ['energy'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  return {
    energy: currentEnergy,
    maxEnergy: MAX_ENERGY,
    canCommit,
    timeUntilNext,
    consumeEnergy: consumeEnergyMutation.mutateAsync,
    isConsuming: consumeEnergyMutation.isPending,
  }
}
