import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Welcome() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-8">
        <View className="mb-12">
          <Text className="text-5xl font-bold text-gray-900 mb-4">Threshold</Text>
          <Text className="text-xl text-gray-600">
            Commit to collective action.{'\n'}
            Make change happen together.
          </Text>
        </View>

        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-4">
              <Text className="text-indigo-600 font-bold">1</Text>
            </View>
            <Text className="text-gray-700 flex-1">Swipe through causes that matter</Text>
          </View>
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-4">
              <Text className="text-indigo-600 font-bold">2</Text>
            </View>
            <Text className="text-gray-700 flex-1">Commit to reach the threshold</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-4">
              <Text className="text-indigo-600 font-bold">3</Text>
            </View>
            <Text className="text-gray-700 flex-1">Earn points as an early supporter</Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/(auth)/login')}
          className="bg-indigo-600 py-4 rounded-xl active:bg-indigo-700"
        >
          <Text className="text-white text-center font-semibold text-lg">Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
