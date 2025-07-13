import { useEffect } from 'react'
import { UI_TIMING } from '@/constants/gameConstants'
import type { GameStateData, GameMode, Sequence } from '@/types/Game'

type GameAction =
  | { type: 'INITIALIZE_GAME' }
  | { type: 'SET_GAME_MODE'; mode: GameMode }
  | { type: 'START_GAME_WITH_RANDOM_SEQUENCES' }
  | { type: 'START_SEQUENCE'; sequence: Sequence }
  | { type: 'SHOW_SEQUENCE' }
  | { type: 'SEQUENCE_COMPLETE' }
  | { type: 'WAIT_FOR_INPUT' }
  | { type: 'ADD_USER_INPUT'; buttonNumber: number }
  | { type: 'CLEAR_USER_INPUT' }
  | { type: 'CHECK_INPUT' }
  | { type: 'INPUT_SUCCESS' }
  | { type: 'INPUT_FAILURE'; message: string }
  | { type: 'NEXT_SEQUENCE' }
  | { type: 'NEXT_ADDITIVE_LEVEL' }
  | { type: 'RETRY_SEQUENCE' }
  | { type: 'GAME_COMPLETE' }
  | { type: 'RESET_GAME' }
  | { type: 'CLEAR_BUTTON_STATES' }

type GameStateHookReturn = {
  gameState: GameStateData
  dispatch: React.Dispatch<GameAction>
  setGameMode: (mode: GameMode) => void
  startSequence: (sequenceIndex?: number) => void
  startGameWithRandomSequences: () => void
  addUserInput: (buttonNumber: number) => void
  checkUserInput: () => void
  nextSequence: () => void
  retrySequence: () => void
  resetGame: () => void
  getCurrentSequenceButtons: () => number[]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.gameState.currentState, gameState.gameState.gameMode, gameState.gameState.currentAdditiveLevel, gameState.gameState.maxAdditiveLevel, gameState.gameState.currentSequenceIndex, gameState.gameState.sequences.length, gameState.dispatch])
} 