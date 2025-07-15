import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
 * Features animated entrance and exit with fade and slide animations
 */
export const PreGameComponent: React.FC<PreGameComponentProps> = ({ 
  gameState, 
  onStartGameWithMode, 
  className 
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('easy')
  const [shouldRender, setShouldRender] = useState(true) // Start as true since this is the initial component

  // Handle component visibility with proper exit animation timing
  useEffect(() => {
    if (gameState.currentState === 'GAME_NOT_STARTED') {
      // Only add delay if we're coming back from another state
      if (shouldRender === false) {
        // Add delay when coming back from GameCompleteComponent to ensure proper sequencing
        const timer = setTimeout(() => {
          setShouldRender(true)
        }, 600) // Wait for GameCompleteComponent exit animation + small buffer
        
        return () => clearTimeout(timer)
      }
      // If already true, stay true
    } else {
      // Allow time for exit animation to complete before stopping render
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 500) // Match exit animation duration
      
      return () => clearTimeout(timer)
    }
  }, [gameState.currentState, shouldRender])

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

  // Don't render if not ready to show
  if (!shouldRender) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      {gameState.currentState === 'GAME_NOT_STARTED' && (
        <motion.div
          key="pregame"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`flex flex-col items-center justify-center space-y-8 w-full ${className}`}
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  )
} 