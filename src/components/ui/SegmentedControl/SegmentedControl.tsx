import React from 'react'
import { cn } from '@/lib/utils'
import type { SegmentedControlProps, DifficultyLevel } from './SegmentedControl.types'

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
      <label className="text-sm font-bold text-black">
        Select Difficulty
      </label>
      
      <div className="flex border-[3px] border-black rounded-[24px] shadow-[0_4px_0_0_black] overflow-hidden">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'relative flex items-center cursor-pointer px-6 py-3 transition-all duration-150 font-bold text-sm select-none',
              'border-r-[3px] border-black last:border-r-0',
              selectedValue === option.value
                ? 'bg-custom-orange text-black shadow-inner'
                : 'bg-transparent text-black hover:bg-custom-orange/90 active:bg-custom-orange/80'
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
            <span>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
} 