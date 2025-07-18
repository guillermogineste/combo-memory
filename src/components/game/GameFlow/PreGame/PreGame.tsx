import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ModeSelector } from './ModeSelector'
import { SegmentedControl } from '../../../ui/SegmentedControl'
import { Button } from '../../../ui/Button'
import type { PreGameProps } from './PreGame.types'
import type { GameMode, DifficultyLevel } from '@/types/Game'

/**
 * PreGame component that displays before the game starts
 * Shows game mode selection, difficulty selection, and play button
 * Features animated entrance with fade and slide animations
 */
export const PreGame: React.FC<PreGameProps> = ({ 
  gameState, 
  onStartGameWithMode, 
  className 
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('easy')
  const [selectedMode, setSelectedMode] = useState<GameMode>('QUICK_MODE')

  /**
   * Handle game mode selection change
   * @param mode - The selected game mode
   */
  const handleModeChange = (mode: GameMode) => {
    console.log('PreGame: Mode changed to:', mode) // Debug log
    setSelectedMode(mode)
  }

  /**
   * Handle difficulty selection change
   * @param difficulty - The selected difficulty level
   */
  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    console.log('PreGame: Difficulty changed to:', difficulty) // Debug log
    setSelectedDifficulty(difficulty)
  }

  /**
   * Handle game start with selected mode and difficulty
   */
  const handleStartGame = () => {
    console.log('PreGame: Starting game with mode:', selectedMode, 'difficulty:', selectedDifficulty) // Debug log
    onStartGameWithMode(selectedMode, selectedDifficulty)
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
        selectedMode={selectedMode}
        onModeChange={handleModeChange}
      />

      {/* Difficulty Selection */}
      <SegmentedControl
        selectedValue={selectedDifficulty}
        onValueChange={handleDifficultyChange}
      />

      {/* Play Button - Primary Red Style */}
      <Button 
        onClick={handleStartGame} 
        size="large"
        className="w-[90vw] sm:w-auto px-6 py-2 bg-custom-red hover:bg-custom-red-light text-white"
      >
        <span className="text-xl font-heading">Play</span>
      </Button>
    </motion.div>
  )
} 