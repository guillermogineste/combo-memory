/**
 * Difficulty levels available for game sequences
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export interface SegmentedControlProps {
  /** Currently selected difficulty level */
  selectedValue: DifficultyLevel
  /** Callback when difficulty selection changes */
  onValueChange: (value: DifficultyLevel) => void
  /** Optional className for styling */
  className?: string
} 