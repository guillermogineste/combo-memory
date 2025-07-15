import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UIButton } from './UIButton'
import type { GameStateData } from '@/types/Game'

export interface GameCompleteComponentProps {
  gameState: GameStateData
  onResetGame: () => void
  className?: string
}

/**
 * GameCompleteComponent that displays when the game is complete
 * Shows "Well done!" and a restart button
 * Features animated entrance with fade-in and slide-up animation
 */
export const GameCompleteComponent: React.FC<GameCompleteComponentProps> = ({ 
  gameState, 
  onResetGame,
  className 
}) => {
  const [shouldRender, setShouldRender] = useState(false)

  // Handle component visibility with proper timing
  useEffect(() => {
    if (gameState.currentState === 'GAME_COMPLETE') {
      // Add delay before showing to allow GamePlayComponent to exit
      const timer = setTimeout(() => {
        setShouldRender(true)
      }, 400) // Wait for GamePlayComponent exit animation + small buffer
      
      return () => clearTimeout(timer)
    } else {
      // Allow time for exit animation to complete before stopping render
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 500) // Match exit animation duration
      
      return () => clearTimeout(timer)
    }
  }, [gameState.currentState])

  // Render during game complete state or while exit animation is playing
  if (!shouldRender) {
    return null
  }

  console.log('GameCompleteComponent: Rendering game complete interface') // Debug log

  return (
    <AnimatePresence mode="wait">
      {gameState.currentState === 'GAME_COMPLETE' && (
        <motion.div
          key="gamecomplete"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`flex flex-col items-center justify-center space-y-8 w-full ${className}`}
        >
          <p className="text-black font-bold text-lg">
            Well done!
          </p>
          
          <UIButton onClick={onResetGame}>
            Restart
          </UIButton>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 