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

  // Auto-progress after success
  useEffect(() => {
    if (gameState.gameState.currentState === 'SUCCESS') {
      console.log('Success - auto-progressing to next sequence') // Debug log
      const timer = setTimeout(() => {
        gameState.nextSequence()
      }, UI_TIMING.successDelay)

      return () => clearTimeout(timer)
    }
  }, [gameState.gameState.currentState, gameState.nextSequence])

  // Auto-start next sequence after progression between sequences/levels during active game
  useEffect(() => {
    if (gameState.gameState.currentState === 'IDLE' && gameState.gameState.currentSequence) {
      // Only auto-start when in IDLE state (between sequences/levels in active game)
      // GAME_NOT_STARTED state requires explicit user action to start
      console.log('Auto-start triggered - Level:', gameState.gameState.currentAdditiveLevel, 'Sequence:', gameState.gameState.currentSequenceIndex) // Debug log
      
      const timer = setTimeout(() => {
        gameState.startSequence(gameState.gameState.currentSequenceIndex)
      }, UI_TIMING.autoStartDelay)

      return () => clearTimeout(timer)
    }
  }, [gameState.gameState.currentState, gameState.gameState.currentSequence, gameState.gameState.currentSequenceIndex, gameState.gameState.currentAdditiveLevel, gameState.startSequence])
} 