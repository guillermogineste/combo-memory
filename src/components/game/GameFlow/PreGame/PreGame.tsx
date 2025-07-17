import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ModeSelector } from './ModeSelector'
import { SegmentedControl } from '../../../ui/SegmentedControl'
import type { PreGameProps } from './PreGame.types'

/**
 * PreGame component that displays before the game starts
 * Shows difficulty selection and game mode selection
 * Features animated entrance with fade and slide animations
 */
export const PreGame: React.FC<PreGameProps> = ({ 
  gameState, 
  onStartGameWithMode, 
  className 
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')

  /**
   * Handle game mode selection with the current difficulty
   * @param mode - The selected game mode
   */
  const handleStartGameWithMode = (mode: any) => {
    console.log('PreGame: Starting game with mode:', mode, 'difficulty:', selectedDifficulty) // Debug log
    onStartGameWithMode(mode, selectedDifficulty)
  }

  /**
   * Handle difficulty selection change
   * @param difficulty - The selected difficulty level
   */
  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard') => {
    console.log('PreGame: Difficulty changed to:', difficulty) // Debug log
    setSelectedDifficulty(difficulty)
  }

  console.log('PreGame: Rendering pre-game interface') // Debug log

  return (
    <motion.div
      key="pregame"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col items-center space-y-8 ${className}`}
    >
      {/* Game Mode Selection */}
      <ModeSelector 
        gameState={gameState} 
        onStartGameWithMode={handleStartGameWithMode}
      />

      {/* Difficulty Selection */}
      <SegmentedControl
        selectedValue={selectedDifficulty}
        onValueChange={handleDifficultyChange}
      />
    </motion.div>
  )
} 