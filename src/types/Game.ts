/**
 * Game state enum
 */
export type GameState = 
  | 'GAME_NOT_STARTED'
  | 'SHOWING_SEQUENCE'
  | 'WAITING_FOR_INPUT'
  | 'CHECKING_INPUT'
  | 'SUCCESS'
  | 'FAILURE'
  | 'GAME_COMPLETE'

/**
 * Game mode enum
 */
export type GameMode = 'QUICK_MODE' | 'CHAIN_COMBINATION_MODE'

/**
 * Game settings interface
 */
export interface GameSettings {
  /** Whether players can retry failed sequences */
  allowRetries: boolean
  /** Whether to show progress indicators */
  showProgress: boolean
  /** Whether to play sound effects */
  playSound: boolean
}

/**
 * Individual sequence configuration
 */
export interface Sequence {
  /** Unique identifier for the sequence */
  id: number
  /** Array of button numbers (1-8) or nested arrays for chain combination mode */
  sequence: number[] | number[][]
}

/**
 * Complete game configuration loaded from JSON
 */
export interface GameConfig {
  /** Quick mode sequences (short sequences) */
  quickModeSequences: Sequence[]
  /** Chain combination mode sequences (long sequences) */
  chainCombinationModeSequences: Sequence[]
}

/**
 * Current game state data
 */
export interface GameStateData {
  /** Current phase of the game */
  currentState: GameState
  /** Current game mode (quick mode or chain combination mode) */
  gameMode: GameMode
  /** Index of the current sequence being played */
  currentSequenceIndex: number
  /** The current sequence being played */
  currentSequence: Sequence | null
  /** Current level in chain combination mode (0-based index of groups) */
  currentAdditiveLevel: number
  /** Maximum level for current sequence in chain combination mode */
  maxAdditiveLevel: number
  /** User's input buffer (buttons pressed) */
  userInput: number[]
  /** Current attempt number for the current sequence */
  currentAttempt: number
  /** Player's score */
  score: number
  /** All available sequences */
  sequences: Sequence[]
  /** Game configuration */
  gameSettings: GameSettings
  /** Error message if any */
  errorMessage: string | null
  /** Last pressed button number (1-8) */
  lastPressedButton: number | null
  /** Result of the last pressed button (success, fail, or null) */
  lastButtonResult: 'success' | 'fail' | null
} 