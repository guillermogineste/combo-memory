/**
 * Game constants for Simon Says
 */

/**
 * Timing configuration for sequence playback
 */
export const GAME_TIMING = {
  /** Duration to highlight each button in milliseconds */
  buttonHighlightDuration: 500,
  /** Pause between button highlights in milliseconds */
  pauseBetweenButtons: 200,
  /** Pause before user can start inputting in milliseconds */
  pauseBeforeUserInput: 1000,
} as const

/**
 * Maximum number of attempts allowed for any sequence
 */
export const MAX_ATTEMPTS = 3

/**
 * Number of sequences to select for each game mode
 */
export const SEQUENCES_PER_GAME = {
  /** Number of sequences to select for quick mode */
  QUICK_MODE: 5,
  /** Number of sequences to select for chain combination mode */
  CHAIN_COMBINATION_MODE: 3,
} as const

/**
 * Global game settings
 */
export const GAME_SETTINGS = {
  /** Whether players can retry failed sequences */
  allowRetries: true,
  /** Whether to show progress indicators */
  showProgress: true,
  /** Whether to play sound effects */
  playSound: false,
} as const

/**
 * Game scoring configuration
 */
export const SCORING = {
  /** Points awarded for completing a quick mode sequence */
  quickModePoints: 10,
  /** Points awarded for completing a chain combination level */
  chainCombinationPoints: 5,
} as const

/**
 * UI timing constants
 */
export const UI_TIMING = {
  /** Time to wait before progressing to next sequence after success */
  successDelay: 1500,
  /** Time to wait before auto-starting next sequence/level */
  autoStartDelay: 500,
  /** Duration of button press visual feedback */
  buttonPressedDuration: 150,
} as const 