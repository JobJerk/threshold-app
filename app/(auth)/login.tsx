import { useState } from 'react'
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { signInWithEmail } = useAuth()

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email')
      return
    }

    setLoading(true)
    const { error } = await signInWithEmail(email)
    setLoading(false)

    if (error) {
      Alert.alert('Error', error.message)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center px-8">
          <View className="items-center">
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
              <Text className="text-4xl">✓</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">Check your email</Text>
            <Text className="text-gray-600 text-center">
              We sent a magic link to{'\n'}
              <Text className="font-semibold">{email}</Text>
            </Text>
            <Pressable onPress={() => setSent(false)} className="mt-8">
              <Text className="text-indigo-600 font-medium">Use a different email</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Sign in</Text>
          <Text className="text-gray-600 mb-8">Enter your email to receive a magic link</Text>

          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-4 mb-4 text-lg"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Pressable
            onPress={handleSignIn}
            disabled={loading}
            className={`py-4 rounded-xl ${loading ? 'bg-gray-400' : 'bg-indigo-600 active:bg-indigo-700'}`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Text>
          </Pressable>

          <View className="mt-8">
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-4 text-gray-500">or continue with</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            <Pressable className="border border-gray-300 py-4 rounded-xl mb-3 flex-row items-center justify-center">
              <Text className="text-gray-700 font-medium">Continue with Google</Text>
            </Pressable>

            <Pressable className="bg-black py-4 rounded-xl flex-row items-center justify-center">
              <Text className="text-white font-medium">Continue with Apple</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
