import { useEffect, useRef, useCallback } from 'react'
import type { Sequence } from '@/types/Game'
import { GAME_TIMING } from '@/constants/gameConstants'

interface UseSequencePlaybackProps {
  sequence: Sequence | null
  isPlaying: boolean
  onSequenceComplete: () => void
  onButtonHighlight: (buttonNumber: number | null) => void
  /** Custom buttons to play - if provided, overrides sequence buttons */
  customButtons?: number[]
}

/**
 * Custom hook for managing sequence playback with timing
 * @param sequence - The sequence to play
 * @param isPlaying - Whether the sequence should be playing
 * @param onSequenceComplete - Callback when sequence playback is complete
 * @param onButtonHighlight - Callback when a button should be highlighted (null to clear)
 * @param customButtons - Custom buttons to play (overrides sequence buttons)
 */
export function useSequencePlayback({
  sequence,
  isPlaying,
  onSequenceComplete,
  onButtonHighlight,
  customButtons
}: UseSequencePlaybackProps) {
  const timeoutRefs = useRef<NodeJS.Timeout[]>([])
  const isPlayingRef = useRef(isPlaying)

  // Update ref when isPlaying changes
  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  /**
   * Clear all timeouts
   */
  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
    timeoutRefs.current = []
  }, [])

  /**
   * Play the sequence with timing
   */
  const playSequence = useCallback(() => {
    if (!sequence || !isPlayingRef.current) {
      console.log('Cannot play sequence: missing sequence or not playing')
      return
    }

    // Use custom buttons if provided, otherwise get buttons from sequence
    let buttonsToPlay: number[] = []
    
    if (customButtons) {
      buttonsToPlay = customButtons
    } else {
      // Extract buttons from sequence based on its structure
      if (Array.isArray(sequence.sequence)) {
        if (sequence.sequence.length > 0 && Array.isArray(sequence.sequence[0])) {
          // This is a nested array (chain combination mode) - shouldn't happen without customButtons
          console.warn('Chain combination mode sequence provided without customButtons')
          return
        } else {
          // This is a flat array (quick mode)
          buttonsToPlay = sequence.sequence as number[]
        }
      }
    }
    
    if (buttonsToPlay.length === 0) {
      console.log('No buttons to play')
      return
    }

    console.log('Starting sequence playback - Buttons:', buttonsToPlay)
    
    // Clear any existing timeouts
    clearTimeouts()

    const {
      buttonHighlightDuration,
      pauseBetweenButtons,
      pauseBeforeUserInput
    } = GAME_TIMING

    let currentTime = 0

    // Play each button in sequence
    buttonsToPlay.forEach((buttonNumber) => {
      // Schedule button highlight
      const highlightTimeout = setTimeout(() => {
        if (isPlayingRef.current) {
          onButtonHighlight(buttonNumber)
        }
      }, currentTime)
      timeoutRefs.current.push(highlightTimeout)

      // Schedule button unhighlight
      const unhighlightTimeout = setTimeout(() => {
        if (isPlayingRef.current) {
          onButtonHighlight(null)
        }
      }, currentTime + buttonHighlightDuration)
      timeoutRefs.current.push(unhighlightTimeout)

      // Update timing for next button
      currentTime += buttonHighlightDuration + pauseBetweenButtons
    })

    // Schedule sequence completion
    const completeTimeout = setTimeout(() => {
      if (isPlayingRef.current) {
        console.log('Sequence playback complete')
        onButtonHighlight(null) // Clear any highlights
        onSequenceComplete()
      }
    }, currentTime - pauseBetweenButtons + pauseBeforeUserInput)
    timeoutRefs.current.push(completeTimeout)

  }, [sequence, customButtons, onSequenceComplete, onButtonHighlight, clearTimeouts])

  /**
   * Stop sequence playback
   */
  const stopSequence = useCallback(() => {
    clearTimeouts()
    onButtonHighlight(null) // Clear any highlights
  }, [clearTimeouts, onButtonHighlight])

  // Effect to start/stop playback when isPlaying changes
  useEffect(() => {
    if (isPlaying && sequence) {
      playSequence()
    } else {
      stopSequence()
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      stopSequence()
    }
  }, [isPlaying, sequence, customButtons, playSequence, stopSequence])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts()
    }
  }, [clearTimeouts])

  return {
    playSequence,
    stopSequence,
    clearTimeouts
  }
} 