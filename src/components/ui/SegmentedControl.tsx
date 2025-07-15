import React from 'react'
import { cn } from '@/lib/utils'

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

/**
 * SegmentedControl component for selecting difficulty levels
 * Appears as a unified button with three segments (Easy|Medium|Hard)
 * Uses radio button functionality underneath
 */
export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  selectedValue,
  onValueChange,
  className
}) => {
  const options: { value: DifficultyLevel; label: string }[] = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ]

  /**
   * Handle radio button change event
   * @param value - The selected difficulty level
   */
  const handleOptionChange = (value: DifficultyLevel) => {
    console.log('Difficulty selected:', value) // Debug log
    onValueChange(value)
  }

  return (
    <div className={cn('flex flex-col items-center space-y-2', className)}>
      <label className="text-sm font-medium text-gray-700">
        Select Difficulty
      </label>
      
      <div className="flex bg-gray-200 rounded-lg p-1">
        {options.map((option, index) => (
          <label
            key={option.value}
            className={cn(
              'relative flex items-center cursor-pointer px-4 py-2 rounded-md transition-all duration-200',
              'first:rounded-l-lg last:rounded-r-lg',
              selectedValue === option.value
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <input
              type="radio"
              name="difficulty"
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => handleOptionChange(option.value)}
              className="absolute opacity-0 pointer-events-none"
            />
            <span className="font-medium text-sm">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
} 