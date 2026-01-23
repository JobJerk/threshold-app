import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from './useProfile'
import {
  MAX_ENERGY,
  ENERGY_PER_COMMIT,
  calculateCurrentEnergy,
  hasEnoughEnergy,
  consumeEnergy,
  getTimeUntilNextEnergy,
} from '@/lib/energy/manager'

export function useEnergy() {
  const { user } = useAuth()
  const { data: profile, refetch: refetchProfile } = useProfile()
  const queryClient = useQueryClient()

  // Calculate current energy from profile data with auto-refill logic
  const currentEnergy = profile
    ? calculateCurrentEnergy(
        profile.energy,
        new Date(profile.last_energy_reset)
      )
    : MAX_ENERGY

  const canCommit = hasEnoughEnergy(currentEnergy)

  const timeUntilNext = profile
    ? getTimeUntilNextEnergy(currentEnergy, new Date(profile.last_energy_reset))
    : null

  const consumeEnergyMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')
      await consumeEnergy(user.id, ENERGY_PER_COMMIT)
    },
    onSuccess: () => {
      // Refetch profile to get updated energy
      refetchProfile()
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
