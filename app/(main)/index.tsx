import { useRef, useState, useCallback } from 'react'
import { View, Text, Dimensions, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Swiper from 'react-native-deck-swiper'
import { PartyPopper } from 'lucide-react-native'
import { Header } from '@/components/layout/Header'
import { ThresholdCard } from '@/components/threshold/ThresholdCard'
import { useThresholds } from '@/hooks/useThresholds'
import { useCommitment } from '@/hooks/useCommitment'
import { useEnergy } from '@/hooks/useEnergy'
import { Threshold } from '@/lib/supabase/types'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function Home() {
  const { data: thresholds, isLoading, error } = useThresholds()
  const { mutate: commit, isPending: isCommitting } = useCommitment()
  const { energy, canCommit, timeUntilNext } = useEnergy()
  const swiperRef = useRef<Swiper<Threshold>>(null)
  const [cardIndex, setCardIndex] = useState(0)

  const onSwipedRight = useCallback(
    (index: number) => {
      if (!thresholds) return

      // Check if user has enough energy
      if (!canCommit) {
        const timeMsg = timeUntilNext
          ? `\n\nEnergy refills in ${timeUntilNext.minutes}m ${timeUntilNext.seconds}s, or fully resets at midnight.`
          : ''
        Alert.alert(
          'Out of Energy',
          `You need energy to commit to causes. Pass on this one for now, or wait for your energy to refill.${timeMsg}`,
          [{ text: 'OK' }]
        )
        // Swipe the card back (undo the swipe)
        swiperRef.current?.swipeBack()
        return
      }

      const threshold = thresholds[index]
      commit(
        { threshold },
        {
          onSuccess: ({ points, newBadges }) => {
            let message = `You earned ${points} points for supporting this cause.`
            if (newBadges && newBadges.length > 0) {
              const badgeNames = newBadges.map((b) => b.badge_name).join(', ')
              message += `\n\nNew badges earned: ${badgeNames}`
            }
            Alert.alert('Committed!', message)
          },
          onError: (err) => {
            Alert.alert('Error', err.message)
          },
        }
      )
    },
    [thresholds, commit, canCommit, timeUntilNext]
  )

  const onSwipedLeft = useCallback(() => {
    // Pass - no action needed
  }, [])

  const onSwipedAll = useCallback(() => {
    setCardIndex(thresholds?.length ?? 0)
  }, [thresholds])

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Header />
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-secondary">Loading thresholds...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Header />
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-error text-center">Error loading thresholds. Please try again.</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!thresholds || thresholds.length === 0 || cardIndex >= thresholds.length) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Header />
        <View className="flex-1 items-center justify-center px-8">
          <View className="items-center">
            <PartyPopper size={64} color="#f59e0b" />
            <Text className="text-2xl font-bold text-text-primary mb-2 text-center mt-4">
              You're all caught up!
            </Text>
            <Text className="text-text-secondary text-center">
              No more thresholds for now.{'\n'}Check back tomorrow for new causes.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
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
                  backgroundColor: '#1a1a1a',
                  borderColor: '#666666',
                  color: '#666666',
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
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  borderColor: '#f59e0b',
                  color: '#f59e0b',
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
