/**
 * Game state enum representing different phases of the Simon Says game
 */
export type GameState = 
  | 'IDLE'
  | 'SHOWING_SEQUENCE'
  | 'WAITING_FOR_INPUT'
  | 'CHECKING_INPUT'
  | 'SUCCESS'
  | 'FAILURE'
  | 'GAME_COMPLETE'

/**
 * Timing configuration for sequence playback
 */
export interface SequenceTiming {
  /** Duration to highlight each button in milliseconds */
  buttonHighlightDuration: number
  /** Pause between button highlights in milliseconds */
  pauseBetweenButtons: number
  /** Pause before user can start inputting in milliseconds */
  pauseBeforeUserInput: number
}

/**
 * Individual sequence configuration
 */
export interface Sequence {
  /** Unique identifier for the sequence */
  id: number
  /** Display name for the sequence */
  name: string
  /** Array of button numbers (1-8) that make up the sequence */
  buttons: number[]
  /** Timing configuration for this sequence */
  timing: SequenceTiming
  /** Maximum number of attempts allowed for this sequence */
  maxAttempts: number
  /** Difficulty level for display purposes */
  difficulty: 'easy' | 'medium' | 'hard'
}

/**
 * Game settings configuration
 */
export interface GameSettings {
  /** Whether to allow retries after failures */
  allowRetries: boolean
  /** Whether to show progress indicators */
  showProgress: boolean
  /** Whether to play sounds (future feature) */
  playSound: boolean
}

/**
 * Complete game configuration loaded from JSON
 */
export interface GameConfig {
  /** Array of all available sequences */
  sequences: Sequence[]
  /** Global game settings */
  gameSettings: GameSettings
}

/**
 * Current game state data
 */
export interface GameStateData {
  /** Current phase of the game */
  currentState: GameState
  /** Index of the current sequence being played */
  currentSequenceIndex: number
  /** The current sequence being played */
  currentSequence: Sequence | null
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
} 