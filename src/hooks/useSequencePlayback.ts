import { useEffect, useRef, useCallback } from 'react'
import type { Sequence } from '@/types/Game'

interface UseSequencePlaybackProps {
  sequence: Sequence | null
  isPlaying: boolean
  onSequenceComplete: () => void
  onButtonHighlight: (buttonNumber: number | null) => void
}

/**
 * Custom hook for managing sequence playback with timing
 * @param sequence - The sequence to play
 * @param isPlaying - Whether the sequence should be playing
 * @param onSequenceComplete - Callback when sequence playback is complete
 * @param onButtonHighlight - Callback when a button should be highlighted (null to clear)
 */
export function useSequencePlayback({
  sequence,
  isPlaying,
  onSequenceComplete,
  onButtonHighlight
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

    console.log('Starting sequence playback:', sequence.name)
    
    // Clear any existing timeouts
    clearTimeouts()

    const { buttons, timing } = sequence
    const {
      buttonHighlightDuration,
      pauseBetweenButtons,
      pauseBeforeUserInput
    } = timing

    let currentTime = 0

    // Play each button in sequence
    buttons.forEach((buttonNumber) => {
      // Schedule button highlight
      const highlightTimeout = setTimeout(() => {
        if (isPlayingRef.current) {
          console.log(`Highlighting button ${buttonNumber}`)
          onButtonHighlight(buttonNumber)
        }
      }, currentTime)
      timeoutRefs.current.push(highlightTimeout)

      // Schedule button unhighlight
      const unhighlightTimeout = setTimeout(() => {
        if (isPlayingRef.current) {
          console.log(`Unhighlighting button ${buttonNumber}`)
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

  }, [sequence, onSequenceComplete, onButtonHighlight, clearTimeouts])

  /**
   * Stop sequence playback
   */
  const stopSequence = useCallback(() => {
    console.log('Stopping sequence playback')
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
  }, [isPlaying, sequence, playSequence, stopSequence])

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