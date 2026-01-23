import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Layers, Target, Zap } from 'lucide-react-native'

export default function Welcome() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-8">
        <View className="mb-12">
          <Text className="text-5xl font-bold text-text-primary mb-4">Threshold</Text>
          <Text className="text-xl text-text-secondary">
            Commit to collective action.{'\n'}
            Make change happen together.
          </Text>
        </View>

        <View className="mb-8">
          <View className="flex-row items-center mb-5">
            <View className="w-12 h-12 bg-accent-muted rounded-full items-center justify-center mr-4">
              <Layers size={22} color="#f59e0b" />
            </View>
            <Text className="text-text-secondary flex-1">Swipe through causes that matter</Text>
          </View>
          <View className="flex-row items-center mb-5">
            <View className="w-12 h-12 bg-accent-muted rounded-full items-center justify-center mr-4">
              <Target size={22} color="#f59e0b" />
            </View>
            <Text className="text-text-secondary flex-1">Commit to reach the threshold</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-accent-muted rounded-full items-center justify-center mr-4">
              <Zap size={22} color="#f59e0b" />
            </View>
            <Text className="text-text-secondary flex-1">Earn points as an early supporter</Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/(auth)/login')}
          className="bg-accent py-4 rounded-xl active:bg-accent-dark"
        >
          <Text className="text-bg-primary text-center font-semibold text-lg">Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
