import { supabase } from '@/lib/supabase/client'

export const MAX_ENERGY = 10
export const ENERGY_PER_COMMIT = 1

export interface EnergyState {
  current: number
  max: number
  lastReset: Date
}

/**
 * Calculate the current energy considering auto-refill rules:
 * - Full reset to 10 at midnight
 * - +1 per hour since last reset (up to max)
 */
export function calculateCurrentEnergy(
  storedEnergy: number,
  lastResetDate: Date
): number {
  const now = new Date()
  const lastReset = new Date(lastResetDate)

  // Check if we've crossed midnight since last reset
  if (lastReset.toDateString() !== now.toDateString()) {
    return MAX_ENERGY
  }

  // Calculate hours since last reset for hourly recharge
  const hoursSinceReset = Math.floor(
    (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60)
  )

  if (hoursSinceReset >= 1 && storedEnergy < MAX_ENERGY) {
    return Math.min(storedEnergy + hoursSinceReset, MAX_ENERGY)
  }

  return storedEnergy
}

/**
 * Check if user has enough energy for a commit
 */
export function hasEnoughEnergy(currentEnergy: number): boolean {
  return currentEnergy >= ENERGY_PER_COMMIT
}

/**
 * Consume energy via database RPC (atomic operation)
 */
export async function consumeEnergy(
  userId: string,
  amount: number = ENERGY_PER_COMMIT
): Promise<void> {
  const { error } = await supabase.rpc('consume_energy', {
    p_user_id: userId,
    amount,
  } as never)

  if (error) {
    if (error.message.includes('Insufficient energy')) {
      throw new Error('Not enough energy to commit')
    }
    throw error
  }
}

/**
 * Get current energy with auto-refill from database
 */
export async function getEnergyWithRefill(userId: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_energy_with_refill', {
    p_user_id: userId,
  } as never)

  if (error) throw error
  return data as number
}

/**
 * Get time until next energy point
 * Returns null if energy is already full
 */
export function getTimeUntilNextEnergy(
  currentEnergy: number,
  lastResetDate: Date
): { minutes: number; seconds: number } | null {
  if (currentEnergy >= MAX_ENERGY) return null

  const now = new Date()
  const lastReset = new Date(lastResetDate)

  // Check if midnight reset is coming
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const msUntilMidnight = tomorrow.getTime() - now.getTime()
  const msUntilNextHour = (60 - (now.getMinutes() % 60)) * 60 * 1000 - now.getSeconds() * 1000

  // Use whichever comes first: next hour or midnight
  const msUntilNext = Math.min(msUntilMidnight, msUntilNextHour)

  const totalSeconds = Math.floor(msUntilNext / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return { minutes, seconds }
}
