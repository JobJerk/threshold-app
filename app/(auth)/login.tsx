import { useState } from 'react'
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CheckCircle, ArrowLeft } from 'lucide-react-native'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'expo-router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { signInWithEmail } = useAuth()
  const router = useRouter()

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
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center px-8">
          <View className="items-center">
            <View className="w-20 h-20 bg-success/20 rounded-full items-center justify-center mb-6">
              <CheckCircle size={40} color="#22c55e" />
            </View>
            <Text className="text-2xl font-bold text-text-primary mb-2 text-center">
              Check your email
            </Text>
            <Text className="text-text-secondary text-center">
              We sent a magic link to{'\n'}
              <Text className="font-semibold text-text-primary">{email}</Text>
            </Text>
            <Pressable onPress={() => setSent(false)} className="mt-8">
              <Text className="text-accent font-medium">Use a different email</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 py-2">
        <Pressable onPress={() => router.back()} className="flex-row items-center">
          <ArrowLeft size={20} color="#a3a3a3" />
          <Text className="text-text-secondary ml-2">Back</Text>
        </Pressable>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8">
          <Text className="text-3xl font-bold text-text-primary mb-2">Sign in</Text>
          <Text className="text-text-secondary mb-8">Enter your email to receive a magic link</Text>

          <TextInput
            className="border border-border-default bg-bg-secondary rounded-xl px-4 py-4 mb-4 text-lg text-text-primary"
            placeholder="your@email.com"
            placeholderTextColor="#666666"
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
            className={`py-4 rounded-xl ${loading ? 'bg-text-tertiary' : 'bg-accent active:bg-accent-dark'}`}
          >
            <Text className="text-bg-primary text-center font-semibold text-lg">
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Text>
          </Pressable>

          <View className="mt-8">
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-border-default" />
              <Text className="mx-4 text-text-tertiary">or continue with</Text>
              <View className="flex-1 h-px bg-border-default" />
            </View>

            <Pressable className="border border-border-default py-4 rounded-xl mb-3 flex-row items-center justify-center active:bg-bg-secondary">
              <Text className="text-text-primary font-medium">Continue with Google</Text>
            </Pressable>

            <Pressable className="bg-text-primary py-4 rounded-xl flex-row items-center justify-center active:bg-text-secondary">
              <Text className="text-bg-primary font-medium">Continue with Apple</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
