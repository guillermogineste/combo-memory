import { useReducer, useEffect } from 'react'
import type { GameStateData, Sequence, GameConfig, GameMode } from '@/types/Game'
import { GAME_SETTINGS, SCORING } from '@/constants/gameConstants'
import sequencesData from '@/data/sequences.json'

/**
 * Actions for the game state reducer
 */
type GameAction =
  | { type: 'INITIALIZE_GAME' }
  | { type: 'SET_GAME_MODE'; mode: GameMode }
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

/**
 * Initial game state
 */
const initialGameState: GameStateData = {
  currentState: 'IDLE',
  gameMode: 'QUICK_MODE',
  currentSequenceIndex: 0,
  currentSequence: null,
  currentAdditiveLevel: 0,
  maxAdditiveLevel: 0,
  userInput: [],
  currentAttempt: 1,
  score: 0,
  sequences: [],
  gameSettings: GAME_SETTINGS,
  errorMessage: null
}

/**
 * Get the current sequence to play based on mode and level
 * @param sequence - The full sequence
 * @param mode - Current game mode
 * @param level - Current additive level (0-based)
 * @returns Array of buttons to play
 */
function buildCurrentSequenceButtons(sequence: Sequence, mode: GameMode, level: number): number[] {
  if (mode === 'QUICK_MODE') {
    // For quick mode, sequence is a simple array of numbers
    return sequence.sequence as number[]
  }
  
  // For chain combination mode, sequence is a nested array
  const groups = sequence.sequence as number[][]
  const buttonsToPlay: number[] = []
  
  // Add all buttons from groups 0 to current level
  for (let i = 0; i <= level && i < groups.length; i++) {
    buttonsToPlay.push(...groups[i])
  }
  
  return buttonsToPlay
}

/**
 * Get the expected sequence for input validation
 * @param sequence - The full sequence
 * @param mode - Current game mode
 * @param level - Current additive level (0-based)
 * @returns Array of buttons expected for input
 */
function getExpectedSequence(sequence: Sequence, mode: GameMode, level: number): number[] {
  return buildCurrentSequenceButtons(sequence, mode, level)
}

/**
 * Get the maximum level for a sequence in chain combination mode
 * @param sequence - The sequence to get max level for
 * @param mode - Current game mode
 * @returns Maximum level (0-based)
 */
function getMaxAdditiveLevel(sequence: Sequence, mode: GameMode): number {
  if (mode === 'QUICK_MODE') {
    return 0
  }
  
  // For chain combination mode, max level is the number of groups - 1
  const groups = sequence.sequence as number[][]
  return groups.length - 1
}

/**
 * Game state reducer
 */
function gameStateReducer(state: GameStateData, action: GameAction): GameStateData {
  // Debug chain combination mode state transitions
  if (state.gameMode === 'CHAIN_COMBINATION_MODE') {
    console.log('CHAIN_COMBINATION_MODE - Action:', action.type, 'Current Level:', state.currentAdditiveLevel, 'Max Level:', state.maxAdditiveLevel)
  }

  switch (action.type) {
    case 'INITIALIZE_GAME':
      // Load sequences based on current game mode
      const gameConfig = sequencesData as GameConfig
      const sequences = state.gameMode === 'QUICK_MODE' 
        ? gameConfig.quickModeSequences 
        : gameConfig.chainCombinationModeSequences
      
      return {
        ...initialGameState,
        sequences,
        gameSettings: GAME_SETTINGS
      }

    case 'SET_GAME_MODE':
      // Load sequences based on new game mode
      const gameConfigForMode = sequencesData as GameConfig
      const sequencesForMode = action.mode === 'QUICK_MODE' 
        ? gameConfigForMode.quickModeSequences 
        : gameConfigForMode.chainCombinationModeSequences
      
      return {
        ...state,
        gameMode: action.mode,
        sequences: sequencesForMode,
        currentSequenceIndex: 0,
        currentSequence: null,
        currentAdditiveLevel: 0,
        maxAdditiveLevel: 0,
        userInput: [],
        currentAttempt: 1,
        errorMessage: null
      }

    case 'START_SEQUENCE':
      const maxLevel = getMaxAdditiveLevel(action.sequence, state.gameMode)
      
      // Only reset additive level if this is a different sequence
      const isNewSequence = !state.currentSequence || state.currentSequence.id !== action.sequence.id
      const additiveLevel = (state.gameMode === 'CHAIN_COMBINATION_MODE' && !isNewSequence) ? state.currentAdditiveLevel : 0
      
      console.log('START_SEQUENCE - Max Level:', maxLevel, 'Is New Sequence:', isNewSequence, 'Preserving Level:', additiveLevel) // Debug log
      
      return {
        ...state,
        currentState: 'SHOWING_SEQUENCE',
        currentSequence: action.sequence,
        currentAdditiveLevel: additiveLevel,
        maxAdditiveLevel: maxLevel,
        userInput: [],
        errorMessage: null
      }

    case 'SHOW_SEQUENCE':
      return {
        ...state,
        currentState: 'SHOWING_SEQUENCE'
      }

    case 'SEQUENCE_COMPLETE':
      return {
        ...state,
        currentState: 'WAITING_FOR_INPUT'
      }

    case 'WAIT_FOR_INPUT':
      return {
        ...state,
        currentState: 'WAITING_FOR_INPUT'
      }

    case 'ADD_USER_INPUT':
      return {
        ...state,
        userInput: [...state.userInput, action.buttonNumber]
      }

    case 'CLEAR_USER_INPUT':
      return {
        ...state,
        userInput: []
      }

    case 'CHECK_INPUT':
      return {
        ...state,
        currentState: 'CHECKING_INPUT'
      }

    case 'INPUT_SUCCESS':
      const isChainCombinationMode = state.gameMode === 'CHAIN_COMBINATION_MODE'
      const canAdvanceLevel = isChainCombinationMode && state.currentAdditiveLevel < state.maxAdditiveLevel
      
      console.log('INPUT_SUCCESS - Can advance level:', canAdvanceLevel, 'Current:', state.currentAdditiveLevel, 'Max:', state.maxAdditiveLevel) // Debug log
      
      return {
        ...state,
        currentState: 'SUCCESS',
        score: state.score + (isChainCombinationMode ? SCORING.chainCombinationPoints : SCORING.quickModePoints),
        currentAttempt: 1,
        errorMessage: null
      }

    case 'INPUT_FAILURE':
      return {
        ...state,
        currentState: 'FAILURE',
        currentAttempt: state.currentAttempt + 1,
        errorMessage: action.message,
        userInput: []
      }

    case 'NEXT_ADDITIVE_LEVEL':
      const nextLevel = state.currentAdditiveLevel + 1
      console.log('NEXT_ADDITIVE_LEVEL - Moving from level', state.currentAdditiveLevel, 'to level', nextLevel, 'Max:', state.maxAdditiveLevel) // Debug log
      
      if (nextLevel > state.maxAdditiveLevel) {
        // Completed all levels, move to next sequence
        console.log('All additive levels completed, moving to next sequence') // Debug log
        return {
          ...state,
          currentAdditiveLevel: 0,
          currentState: 'IDLE'
        }
      }
      
      return {
        ...state,
        currentAdditiveLevel: nextLevel,
        currentState: 'IDLE',
        userInput: [],
        currentAttempt: 1,
        errorMessage: null
      }

    case 'NEXT_SEQUENCE':
      const nextIndex = state.currentSequenceIndex + 1
      if (nextIndex >= state.sequences.length) {
        return {
          ...state,
          currentState: 'GAME_COMPLETE'
        }
      }
      return {
        ...state,
        currentSequenceIndex: nextIndex,
        currentSequence: state.sequences[nextIndex],
        currentState: 'IDLE',
        currentAdditiveLevel: 0,
        userInput: [],
        currentAttempt: 1,
        errorMessage: null
      }

    case 'RETRY_SEQUENCE':
      return {
        ...state,
        currentState: 'IDLE',
        userInput: [],
        errorMessage: null
      }

    case 'GAME_COMPLETE':
      return {
        ...state,
        currentState: 'GAME_COMPLETE'
      }

    case 'RESET_GAME':
      return {
        ...initialGameState,
        gameMode: state.gameMode, // Preserve the current game mode
        sequences: state.sequences,
        gameSettings: GAME_SETTINGS
      }

    default:
      return state
  }
}

/**
 * Custom hook for managing Simon Says game state
 * @returns Game state and dispatch function
 */
export function useGameState() {
  const [gameState, dispatch] = useReducer(gameStateReducer, initialGameState)

  // Initialize game on mount
  useEffect(() => {
    dispatch({ type: 'INITIALIZE_GAME' })
  }, [])

  /**
   * Set the game mode
   * @param mode - Game mode to set
   */
  const setGameMode = (mode: GameMode) => {
    dispatch({ type: 'SET_GAME_MODE', mode })
  }

  /**
   * Start playing a specific sequence
   * @param sequenceIndex - Index of the sequence to start
   */
  const startSequence = (sequenceIndex: number = gameState.currentSequenceIndex) => {
    const sequence = gameState.sequences[sequenceIndex]
    if (sequence) {
      dispatch({ type: 'START_SEQUENCE', sequence })
    }
  }

  /**
   * Add user input (button press)
   * @param buttonNumber - Button number that was pressed
   */
  const addUserInput = (buttonNumber: number) => {
    dispatch({ type: 'ADD_USER_INPUT', buttonNumber })
  }

  /**
   * Check if user input matches the current sequence
   */
  const checkUserInput = () => {
    
    if (!gameState.currentSequence) {
      dispatch({ type: 'INPUT_FAILURE', message: 'No sequence to check against' })
      return
    }

    const expectedSequence = getExpectedSequence(
      gameState.currentSequence, 
      gameState.gameMode, 
      gameState.currentAdditiveLevel
    )
    const userInput = gameState.userInput

    // Check if user input matches expected sequence so far
    const isCorrectSoFar = userInput.every((button, index) => button === expectedSequence[index])
    
    if (!isCorrectSoFar) {
      dispatch({ type: 'INPUT_FAILURE', message: 'Incorrect sequence' })
      return
    }

    // Check if user has completed the full expected sequence
    if (userInput.length === expectedSequence.length) {
      dispatch({ type: 'INPUT_SUCCESS' })
    }
    // If correct so far but not complete, continue waiting for input
  }

  /**
   * Move to the next sequence or chain combination level
   */
  const nextSequence = () => {
    if (gameState.gameMode === 'CHAIN_COMBINATION_MODE' && gameState.currentAdditiveLevel < gameState.maxAdditiveLevel) {
      console.log('nextSequence - Dispatching NEXT_ADDITIVE_LEVEL') // Debug log
      dispatch({ type: 'NEXT_ADDITIVE_LEVEL' })
    } else {
      console.log('nextSequence - Dispatching NEXT_SEQUENCE') // Debug log
      dispatch({ type: 'NEXT_SEQUENCE' })
    }
  }

  /**
   * Retry the current sequence
   */
  const retrySequence = () => {
    dispatch({ type: 'RETRY_SEQUENCE' })
  }

  /**
   * Reset the entire game
   */
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' })
  }

  /**
   * Get the current sequence buttons to play based on mode and level
   */
  const getCurrentSequenceButtons = () => {
    if (!gameState.currentSequence) {
      return []
    }
    
    const result = buildCurrentSequenceButtons(
      gameState.currentSequence,
      gameState.gameMode,
      gameState.currentAdditiveLevel
    )
    
    return result
  }

  return {
    gameState,
    dispatch,
    setGameMode,
    startSequence,
    addUserInput,
    checkUserInput,
    nextSequence,
    retrySequence,
    resetGame,
    getCurrentSequenceButtons
  }
} 