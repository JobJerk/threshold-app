import { useRef, useState, useCallback } from 'react'
import { View, Text, Dimensions, Alert, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Swiper from 'react-native-deck-swiper'
import { Header } from '@/components/layout/Header'
import { ThresholdCard } from '@/components/threshold/ThresholdCard'
import { useThresholds } from '@/hooks/useThresholds'
import { useCommitment } from '@/hooks/useCommitment'
import { Threshold } from '@/lib/supabase/types'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function Home() {
  const { data: thresholds, isLoading, error } = useThresholds()
  const { mutate: commit, isPending: isCommitting } = useCommitment()
  const swiperRef = useRef<Swiper<Threshold>>(null)
  const [cardIndex, setCardIndex] = useState(0)

  const onSwipedRight = useCallback(
    (index: number) => {
      if (!thresholds) return
      const threshold = thresholds[index]
      commit(
        { threshold },
        {
          onSuccess: ({ points, newBadges }) => {
            let message = `You earned ${points} points for supporting this cause.`
            if (newBadges && newBadges.length > 0) {
              const badgeNames = newBadges.map((b) => `${b.badge_icon} ${b.badge_name}`).join('\n')
              message += `\n\nNew badges earned:\n${badgeNames}`
            }
            Alert.alert('Committed!', message)
          },
          onError: (err) => {
            Alert.alert('Error', err.message)
          },
        }
      )
    },
    [thresholds, commit]
  )

  const onSwipedLeft = useCallback(() => {
    // Pass - no action needed
  }, [])

  const onSwipedAll = useCallback(() => {
    setCardIndex(thresholds?.length ?? 0)
  }, [thresholds])

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <Header />
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading thresholds...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <Header />
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-red-500 text-center">Error loading thresholds. Please try again.</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!thresholds || thresholds.length === 0 || cardIndex >= thresholds.length) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <Header />
        <View className="flex-1 items-center justify-center px-8">
          <View className="items-center">
            <Text className="text-6xl mb-4">🎉</Text>
            <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
              You're all caught up!
            </Text>
            <Text className="text-gray-600 text-center">
              No more thresholds for now.{'\n'}Check back tomorrow for new causes.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Header />
      <View className="flex-1 pt-4">
        <Swiper
          ref={swiperRef}
          cards={thresholds}
          cardIndex={cardIndex}
          renderCard={(card) => (card ? <ThresholdCard threshold={card} /> : null)}
          onSwipedRight={onSwipedRight}
          onSwipedLeft={onSwipedLeft}
          onSwipedAll={onSwipedAll}
          cardVerticalMargin={20}
          cardHorizontalMargin={0}
          stackSize={3}
          stackSeparation={15}
          animateCardOpacity
          animateOverlayLabelsOpacity
          disableBottomSwipe
          disableTopSwipe
          backgroundColor="transparent"
          overlayLabels={{
            left: {
              title: 'PASS',
              style: {
                label: {
                  backgroundColor: '#e5e7eb',
                  borderColor: '#9ca3af',
                  color: '#6b7280',
                  borderWidth: 2,
                  fontSize: 24,
                  fontWeight: 'bold',
                  padding: 10,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: -30,
                },
              },
            },
            right: {
              title: 'COMMIT',
              style: {
                label: {
                  backgroundColor: '#e0e7ff',
                  borderColor: '#6366f1',
                  color: '#6366f1',
                  borderWidth: 2,
                  fontSize: 24,
                  fontWeight: 'bold',
                  padding: 10,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: 30,
                },
              },
            },
          }}
        />
      </View>
    </SafeAreaView>
  )
}
