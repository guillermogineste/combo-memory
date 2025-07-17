/**
 * Semantic Color Palette
 * Colors defined in index.css using CSS custom properties
 */

// Semantic color names from design palette
export const COLORS = {
  // Dark red variants
  CRIMSON_DARK: 'custom-red',         // #94261F
  CRIMSON_MEDIUM: 'custom-red-light', // #C2433D
  CRIMSON_BRIGHT: 'custom-red-bright', // #E12020
  CRIMSON_DARKER: 'custom-red-darker', // #7E1616
  CRIMSON_PALE: 'custom-red-pale',    // #964843
  
  // Light coral variants  
  CORAL_BRIGHT: 'custom-orange',      // #FF8060
  CORAL_SOFT: 'custom-orange-light',  // #FF9F87
  
  // Ember variants
  EMBER_BRIGHT: 'custom-yellow',      // #FFD45E
  EMBER_SOFT: 'custom-yellow-light',  // #FFA95D
  
  // Nature green variants
  NATURE_BRIGHT: 'custom-green',      // #90B930
  NATURE_DARK: 'custom-green-dark',   // #425E00
  
  // Base colors
  BLACK: 'black',                     // #000000
  WHITE: 'white',                     // #FFFFFF
} as const

// Common usage patterns
export const COLOR_PATTERNS = {
  // Button styles
  PRIMARY_BUTTON: 'bg-custom-red hover:bg-custom-red-light text-white',
  SECONDARY_BUTTON: 'bg-custom-orange hover:bg-custom-orange-light text-black',
  SUCCESS_BUTTON: 'bg-custom-green hover:bg-custom-green-dark text-white',
  DANGER_BUTTON: 'bg-custom-red-bright hover:bg-custom-red-darker text-white',
  
  // Status indicators
  SUCCESS: 'text-custom-green',
  WARNING: 'text-custom-orange',
  ERROR: 'text-custom-red-bright',
  
  // Text colors
  PRIMARY_TEXT: 'text-black',
  ACCENT_TEXT: 'text-custom-red-light',
  SUCCESS_TEXT: 'text-custom-green-dark',
  
  // Background patterns
  SUCCESS_BG: 'bg-custom-green text-white',
  ERROR_BG: 'bg-custom-red-bright text-white',
} as const

// Type definitions
export type SemanticColor = typeof COLORS[keyof typeof COLORS]
export type ColorPattern = typeof COLOR_PATTERNS[keyof typeof COLOR_PATTERNS] 