import React from 'react'
import { motion } from 'framer-motion'
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
  console.log('GameCompleteComponent: Rendering game complete interface') // Debug log

  return (
    <motion.div
      key="gamecomplete"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col items-center space-y-8 ${className}`}
    >
      <p className="text-black font-bold text-lg">
        Well done!
      </p>
      
      <UIButton onClick={onResetGame}>
        Restart
      </UIButton>
    </motion.div>
  )
} 