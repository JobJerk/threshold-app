import { View, Text } from 'react-native'
import { Battery, BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react-native'
import { useEnergy } from '@/hooks/useEnergy'

export function EnergyDisplay() {
  const { energy, maxEnergy } = useEnergy()

  // Determine battery icon based on energy level
  const percentage = (energy / maxEnergy) * 100
  let BatteryIcon = Battery
  let iconColor = '#22c55e' // green

  if (percentage === 0) {
    BatteryIcon = Battery
    iconColor = '#ef4444' // red
  } else if (percentage <= 30) {
    BatteryIcon = BatteryLow
    iconColor = '#ef4444' // red
  } else if (percentage <= 60) {
    BatteryIcon = BatteryMedium
    iconColor = '#f59e0b' // amber
  } else {
    BatteryIcon = BatteryFull
    iconColor = '#22c55e' // green
  }

  return (
    <View className="bg-bg-tertiary px-3 py-1.5 rounded-full flex-row items-center">
      <BatteryIcon size={14} color={iconColor} />
      <Text
        className="font-semibold ml-1"
        style={{ color: iconColor }}
      >
        {energy}/{maxEnergy}
      </Text>
    </View>
  )
}
