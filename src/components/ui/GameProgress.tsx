import React from 'react'
import { cn } from '@/lib/utils'
import type { GameStateData } from '@/types/Game'

export interface GameProgressProps {
  gameState: GameStateData
  className?: string
}

/**
 * GameProgress component that displays the overall game progress
 * Shows segments representing each sequence in the game with current and completed sequences highlighted
 */
export const GameProgress: React.FC<GameProgressProps> = ({ 
  gameState, 
  className 
}) => {
  /**
   * Get the total number of sequences in the game
   * @returns Total number of sequences
   */
  const getTotalSequences = (): number => {
    return gameState.sequences.length
  }

  /**
   * Get the current sequence index for progress calculation
   * @returns Current sequence index (0-based)
   */
  const getCurrentProgress = (): number => {
    // Return the current sequence index directly
    // This will be used to determine which segments are active
    return gameState.currentSequenceIndex
  }

  const totalSequences = getTotalSequences()
  const currentProgress = getCurrentProgress()

  // Don't render if no sequences
  if (totalSequences === 0) {
    return null
  }

  console.log(`GameProgress: Rendering progress ${currentProgress}/${totalSequences}`) // Debug log

  /**
   * Render a single progress segment representing a sequence
   * @param index - Zero-based index of the sequence
   * @returns JSX element for the segment
   */
  const renderSegment = (index: number) => {
    const isCompleted = index < currentProgress
    const isCurrent = index === currentProgress
    const isActive = isCompleted || isCurrent
    
    const isFirst = index === 0
    const isLast = index === totalSequences - 1

    return (
      <div
        key={index}
        className={cn(
          "h-[30px] w-[30px] border-[3px] border-black",
          {
            // Background colors
            "bg-custom-red": isActive,
            "bg-transparent": !isActive,
            
            // Border radius for first and last segments
            "rounded-l-[50%]": isFirst,
            "rounded-r-[50%]": isLast,
            
            // Remove right border for all segments except the last
            "border-r-0": !isLast,
          }
        )}
      />
    )
  }

  return (
    <div className={cn("flex", className)}>
      {Array.from({ length: totalSequences }, (_, index) => renderSegment(index))}
    </div>
  )
} 