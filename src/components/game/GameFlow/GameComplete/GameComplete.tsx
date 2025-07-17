import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../../ui/Button'
import type { GameCompleteProps } from './GameComplete.types'

/**
 * GameComplete component that displays when the game is complete
 * Shows "Well done!" and a restart button
 * Features animated entrance with fade-in and slide-up animation
 */
export const GameComplete: React.FC<GameCompleteProps> = ({ 
  onResetGame,
  className 
}) => {
  console.log('GameComplete: Rendering game complete interface') // Debug log

  return (
    <motion.div
      key="gamecomplete"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col items-center gap-4 ${className}`}
    >
      <h2 className="font-heading text-[26px] text-black">
        Well done!
      </h2>
      
      <Button onClick={onResetGame} className="px-6 py-4">
        <span className="font-interactive">Restart</span>
      </Button>
    </motion.div>
  )
} 