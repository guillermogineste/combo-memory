import React, { useState } from 'react'
import { GameModeStartButtons } from './GameModeStartButtons'
import { SegmentedControl } from './SegmentedControl'
import type { GameStateData, GameMode, DifficultyLevel } from '@/types/Game'

export interface PreGameComponentProps {
  gameState: GameStateData
  onStartGameWithMode: (mode: GameMode, difficulty: DifficultyLevel) => void
  className?: string
}

/**
 * PreGameComponent that displays before the game starts
 * Shows difficulty selection and game mode selection
 */
export const PreGameComponent: React.FC<PreGameComponentProps> = ({ 
  gameState, 
  onStartGameWithMode, 
  className 
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('easy')

  // Only render if game hasn't started
  if (gameState.currentState !== 'GAME_NOT_STARTED') {
    return null
  }

  /**
   * Handle game mode selection with the current difficulty
   * @param mode - The selected game mode
   */
  const handleStartGameWithMode = (mode: GameMode) => {
    console.log('PreGameComponent: Starting game with mode:', mode, 'difficulty:', selectedDifficulty) // Debug log
    onStartGameWithMode(mode, selectedDifficulty)
  }

  /**
   * Handle difficulty selection change
   * @param difficulty - The selected difficulty level
   */
  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    console.log('PreGameComponent: Difficulty changed to:', difficulty) // Debug log
    setSelectedDifficulty(difficulty)
  }

  console.log('PreGameComponent: Rendering pre-game interface') // Debug log

  return (
    <div className={`flex flex-col items-center justify-center space-y-8 w-full ${className}`}>
      {/* Game Mode Selection */}
      <GameModeStartButtons 
        gameState={gameState} 
        onStartGameWithMode={handleStartGameWithMode}
      />

      {/* Difficulty Selection */}
      <SegmentedControl
        selectedValue={selectedDifficulty}
        onValueChange={handleDifficultyChange}
      />
    </div>
  )
} 