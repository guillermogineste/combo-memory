import { useReducer, useEffect } from 'react'
import type { GameStateData, Sequence, GameConfig } from '@/types/Game'
import sequencesData from '@/data/sequences.json'

/**
 * Actions for the game state reducer
 */
type GameAction =
  | { type: 'INITIALIZE_GAME' }
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
  | { type: 'RETRY_SEQUENCE' }
  | { type: 'GAME_COMPLETE' }
  | { type: 'RESET_GAME' }

/**
 * Initial game state
 */
const initialGameState: GameStateData = {
  currentState: 'IDLE',
  currentSequenceIndex: 0,
  currentSequence: null,
  userInput: [],
  currentAttempt: 1,
  score: 0,
  sequences: [],
  gameSettings: {
    allowRetries: true,
    showProgress: true,
    playSound: false
  },
  errorMessage: null
}

/**
 * Game state reducer
 */
function gameStateReducer(state: GameStateData, action: GameAction): GameStateData {
  console.log('Game Action:', action.type, action) // Debug log

  switch (action.type) {
    case 'INITIALIZE_GAME':
      return {
        ...initialGameState,
        sequences: (sequencesData as GameConfig).sequences,
        gameSettings: (sequencesData as GameConfig).gameSettings
      }

    case 'START_SEQUENCE':
      return {
        ...state,
        currentState: 'SHOWING_SEQUENCE',
        currentSequence: action.sequence,
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
      return {
        ...state,
        currentState: 'SUCCESS',
        score: state.score + 10,
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
        sequences: state.sequences,
        gameSettings: state.gameSettings
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
    console.log('Initializing game state') // Debug log
    dispatch({ type: 'INITIALIZE_GAME' })
  }, [])

  /**
   * Start playing a specific sequence
   * @param sequenceIndex - Index of the sequence to start
   */
  const startSequence = (sequenceIndex: number = gameState.currentSequenceIndex) => {
    const sequence = gameState.sequences[sequenceIndex]
    if (sequence) {
      console.log('Starting sequence:', sequence.name) // Debug log
      dispatch({ type: 'START_SEQUENCE', sequence })
    }
  }

  /**
   * Add user input (button press)
   * @param buttonNumber - Button number that was pressed
   */
  const addUserInput = (buttonNumber: number) => {
    console.log('User input:', buttonNumber) // Debug log
    dispatch({ type: 'ADD_USER_INPUT', buttonNumber })
  }

  /**
   * Check if user input matches the current sequence
   */
  const checkUserInput = () => {
    console.log('Checking user input:', gameState.userInput) // Debug log
    
    if (!gameState.currentSequence) {
      dispatch({ type: 'INPUT_FAILURE', message: 'No sequence to check against' })
      return
    }

    const expectedSequence = gameState.currentSequence.buttons
    const userInput = gameState.userInput

    // Check if user input matches expected sequence so far
    const isCorrectSoFar = userInput.every((button, index) => button === expectedSequence[index])
    
    if (!isCorrectSoFar) {
      dispatch({ type: 'INPUT_FAILURE', message: 'Incorrect sequence' })
      return
    }

    // Check if user has completed the full sequence
    if (userInput.length === expectedSequence.length) {
      dispatch({ type: 'INPUT_SUCCESS' })
    }
    // If correct so far but not complete, continue waiting for input
  }

  /**
   * Move to the next sequence
   */
  const nextSequence = () => {
    console.log('Moving to next sequence') // Debug log
    dispatch({ type: 'NEXT_SEQUENCE' })
  }

  /**
   * Retry the current sequence
   */
  const retrySequence = () => {
    console.log('Retrying sequence') // Debug log
    dispatch({ type: 'RETRY_SEQUENCE' })
  }

  /**
   * Reset the entire game
   */
  const resetGame = () => {
    console.log('Resetting game') // Debug log
    dispatch({ type: 'RESET_GAME' })
  }

  return {
    gameState,
    dispatch,
    startSequence,
    addUserInput,
    checkUserInput,
    nextSequence,
    retrySequence,
    resetGame
  }
} 