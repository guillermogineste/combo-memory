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
 * Game mode enum for different play styles
 */
export type GameMode = 
  | 'QUICK_MODE'              // Play short sequences one after another
  | 'CHAIN_COMBINATION_MODE'  // Build long sequences incrementally by groups

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
 * Group definition for chain combination mode
 */
export interface SequenceGroup {
  /** Unique identifier for the group */
  id: number
  /** Display name for the group */
  name: string
  /** Array of button numbers (1-8) that make up this group */
  buttons: number[]
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
  /** Groups for chain combination mode - if not provided, will be auto-generated */
  groups?: SequenceGroup[]
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
  /** Quick mode sequences (short sequences) */
  quickModeSequences: Sequence[]
  /** Chain combination mode sequences (long sequences) */
  chainCombinationModeSequences: Sequence[]
  /** Global game settings */
  gameSettings: GameSettings
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
} 