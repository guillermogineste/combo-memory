/**
 * Semantic Color Palette
 * Colors defined in index.css using CSS custom properties
 */

// Semantic color names from design palette
export const COLORS = {
  // Dark red variants
  CRIMSON_DARK: 'custom-red',         // #94261F
  CRIMSON_MEDIUM: 'custom-red-light', // #C2433D
  
  // Light coral variants  
  CORAL_BRIGHT: 'custom-orange',      // #FF8060
  CORAL_SOFT: 'custom-orange-light',  // #FF9F87
  
  // Ember variants
  EMBER_BRIGHT: 'custom-yellow',      // #FFD45E
  EMBER_SOFT: 'custom-yellow-light',  // #FFA95D
  
  // Base colors
  BLACK: 'black',                     // #000000
  WHITE: 'white',                     // #FFFFFF
} as const

// Common usage patterns
export const COLOR_PATTERNS = {
  // Button styles
  PRIMARY_BUTTON: 'bg-custom-red hover:bg-custom-red-light text-white',
  SECONDARY_BUTTON: 'bg-custom-orange hover:bg-custom-orange-light text-black',
  
  // Status indicators
  SUCCESS: 'text-custom-yellow',
  WARNING: 'text-custom-orange',
  ERROR: 'text-custom-red',
  
  // Text colors
  PRIMARY_TEXT: 'text-black',
  ACCENT_TEXT: 'text-custom-red-light',
} as const

// Type definitions
export type SemanticColor = typeof COLORS[keyof typeof COLORS]
export type ColorPattern = typeof COLOR_PATTERNS[keyof typeof COLOR_PATTERNS] 