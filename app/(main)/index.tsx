import { useRef, useState, useCallback, useMemo } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Swiper from 'react-native-deck-swiper'
import { Sparkles } from 'lucide-react-native'
import { Header } from '@/components/layout/Header'
import { ThresholdCard } from '@/components/threshold/ThresholdCard'
import { useThresholds } from '@/hooks/useThresholds'
import { useCommitment } from '@/hooks/useCommitment'
import { useEnergy } from '@/hooks/useEnergy'
import { Threshold } from '@/lib/supabase/types'
import { showAlert } from '@/utils/alert'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const COMMITMENT_MESSAGES = [
  'Toward the impossible.',
  'The future shifts.',
  'The direction changes.',
  'Crafting the future.',
  'Shaping what comes next.',
  'Beyond where we are.',
  'Something new begins.',
  'Changing everything.',
  'What comes next.',
]

const EMPTY_STATE_MESSAGES = [
  'Decisions made.',
  'Everything given.',
  'The future holds.',
  'Nothing held back.',
  'Fully committed.',
  'Complete.',
  'Given completely.',
  'Committed.',
]

const ENERGY_DEPLETED_MESSAGES = [
  'Full commitment.',
  'Everything given.',
  'Nothing held back.',
  'Gave completely.',
  'Complete for today.',
  'Given fully.',
  'Committed completely.',
  'Your energy went to the future.',
  'Shaped today.',
  'Full participation.',
]

function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)]
}

export default function Home() {
  const { data: thresholds, isLoading, error } = useThresholds()
  const { mutateAsync: commitAsync, isPending: isCommitting } = useCommitment()
  const { energy, canCommit, timeUntilNext } = useEnergy()
  const swiperRef = useRef<Swiper<Threshold>>(null)
  const [cardIndex, setCardIndex] = useState(0)

  const emptyStateMessage = useMemo(() => getRandomMessage(EMPTY_STATE_MESSAGES), [])

  const onSwipedRight = useCallback(
    (index: number) => {
      if (!thresholds) return

      // Check if user has enough energy
      if (!canCommit) {
        const depletedMessage = getRandomMessage(ENERGY_DEPLETED_MESSAGES)
        const timeMsg = timeUntilNext
          ? `\n\nEnergy refills in ${timeUntilNext.minutes}m ${timeUntilNext.seconds}s, or fully resets at midnight.`
          : ''
        showAlert(depletedMessage, `Pass for now, or wait for energy to refill.${timeMsg}`, [
          { text: 'OK' },
        ])
        // Swipe the card back (undo the swipe)
        swiperRef.current?.swipeBack()
        return
      }

      const threshold = thresholds[index]
      commitAsync({ threshold })
        .then(({ points, newBadges }) => {
          const commitMessage = getRandomMessage(COMMITMENT_MESSAGES)
          let message = `+${points} force`
          if (newBadges && newBadges.length > 0) {
            const badgeNames = newBadges.map((b) => b.badge_name).join(', ')
            message += `\n\nNew rank: ${badgeNames}`
          }
          showAlert(commitMessage, message)
        })
        .catch((err: Error) => {
          showAlert('Error', err.message)
        })
    },
    [thresholds, commitAsync, canCommit, timeUntilNext]
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
            <Sparkles size={64} color="#f59e0b" />
            <Text className="text-2xl font-bold text-text-primary mb-2 text-center mt-4">
              {emptyStateMessage}
            </Text>
            <Text className="text-text-secondary text-center">
              New thresholds tomorrow.
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
