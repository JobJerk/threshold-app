import { View, Text, Pressable, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Welcome() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 py-8"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-4xl font-bold text-text-primary mb-8">Threshold</Text>

        <Text className="text-lg text-text-secondary leading-7 mb-6">
          There's a weight most of us carry — that the big problems aren't ours to solve.
        </Text>

        <Text className="text-lg text-text-secondary leading-7 mb-6">
          We're tired. Worn out. Misdirected by so many problems we don't know where to begin.
        </Text>

        <Text className="text-lg text-text-secondary leading-7 mb-6">
          We feel like we can't take on large entities because they have so much money. We can't change the government. We can't solve certain technical problems because there's too much constraint around them.
        </Text>

        <Text className="text-lg text-text-secondary leading-7 mb-6">
          These were the same feelings before we went to the moon.
        </Text>

        <Text className="text-lg text-text-secondary leading-7 mb-6">
          But by combining many patterns and many skills across many industries — by focusing — we did what seemed impossible.
        </Text>

        <Text className="text-lg text-text-secondary leading-7 mb-6">
          Today, the technological evolutions in our hands, especially in information technology, in AI, in our ability to coordinate — these have yet to yield the magnitude of impact that could possibly come out of them. Part of this is because of greed. Part of this is because of direction. Part of this is because there are so many problems we don't even know where to begin.
        </Text>

        <Text className="text-xl font-semibold text-text-primary mb-6">
          This app is about focusing.
        </Text>

        <Text className="text-lg text-text-secondary leading-7 mb-6">
          It's about finding the problems that are worth solving, coordinating, agreeing, actually grabbing a metric around when they'll be feasible — and coordinating that with those who could build. Those who can compete to build.
        </Text>

        <Text className="text-lg text-text-secondary leading-7 mb-2">
          This app is a vision. It's a test.
        </Text>

        <Text className="text-xl font-semibold text-accent mb-6">
          Is now the time? Is this worth it?
        </Text>

        <Text className="text-lg text-text-secondary leading-7 mb-6">
          What you're doing here is not just fun. It's not just interesting. It doesn't just get your mind thinking and breaking down constraints. These are not just cards — they are ideas created by experts and groups of people across industries, ideas that are executable, purposely crafted to get you out of the box.
        </Text>

        <Text className="text-lg text-text-primary leading-7 mb-6 font-medium">
          Every time you swipe, every time you make a commitment, every time you give an insight or add something — you are crafting the future.
        </Text>

        <Text className="text-lg text-text-secondary leading-7 mb-6">
          You don't need the majority to capture and change the direction of an entire community.
        </Text>

        <Text className="text-lg text-text-secondary leading-7 mb-6">
          Our goal is to change the direction of the entire globe. Our goal is to change the direction of every industry. Our goal is to change how we approach responding to problems, because the current ways don't work.
        </Text>

        <Text className="text-lg text-text-secondary leading-7 mb-6">
          This is not for those waiting for someone else, telling us it will correct itself.
        </Text>

        <Text className="text-lg text-text-secondary leading-7 mb-8">
          This process, this community, this venture, this vision — it is for those who are seeking what is next. Not those seeking something slightly better. Something entirely new. Something so much better, so far beyond where we're at today, that nothing else will do.
        </Text>

        <Pressable
          onPress={() => router.push('/(auth)/login')}
          className="bg-accent py-4 rounded-xl active:bg-accent-dark mb-8"
        >
          <Text className="text-bg-primary text-center font-semibold text-lg">I'm Ready</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
