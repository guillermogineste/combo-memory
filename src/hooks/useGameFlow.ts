import { useEffect } from 'react'
import { UI_TIMING } from '@/constants/gameConstants'

type GameStateHookReturn = {
  gameState: any
  dispatch: any
  setGameMode: any
  startSequence: any
  startGameWithRandomSequences: any
  addUserInput: any
  checkUserInput: any
  nextSequence: any
  retrySequence: any
  resetGame: any
  getCurrentSequenceButtons: any
}

/**
 * Custom hook that handles automated game flow logic
 * @param gameState - Game state object from useGameState hook
 */
export function useGameFlow(gameState: GameStateHookReturn) {
  // Auto-check user input whenever it changes
  useEffect(() => {
    if (gameState.gameState.currentState === 'WAITING_FOR_INPUT' && 
        gameState.gameState.userInput.length > 0) {
      console.log('Auto-checking user input:', gameState.gameState.userInput) // Debug log
      gameState.checkUserInput()
    }
  }, [gameState.gameState.userInput, gameState.gameState.currentState, gameState.checkUserInput])

  // Auto-progress after success - directly start next sequence/level
  useEffect(() => {
    if (gameState.gameState.currentState === 'SUCCESS') {
      console.log('Success - auto-progressing to next sequence') // Debug log
      const timer = setTimeout(() => {
        // Determine if we should advance to next level or next sequence
        if (gameState.gameState.gameMode === 'CHAIN_COMBINATION_MODE' && 
            gameState.gameState.currentAdditiveLevel < gameState.gameState.maxAdditiveLevel) {
          // Still have levels to go in current sequence
          gameState.dispatch({ type: 'NEXT_ADDITIVE_LEVEL' })
        } else {
          // Move to next sequence or complete game
          const nextIndex = gameState.gameState.currentSequenceIndex + 1
          if (nextIndex >= gameState.gameState.sequences.length) {
            gameState.dispatch({ type: 'GAME_COMPLETE' })
          } else {
            gameState.dispatch({ type: 'NEXT_SEQUENCE' })
          }
        }
      }, UI_TIMING.successDelay)

      return () => clearTimeout(timer)
    }
  }, [gameState.gameState.currentState, gameState.gameState.gameMode, gameState.gameState.currentAdditiveLevel, gameState.gameState.maxAdditiveLevel, gameState.gameState.currentSequenceIndex, gameState.gameState.sequences.length, gameState.dispatch])
} 