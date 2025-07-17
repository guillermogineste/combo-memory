import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../../../ui/Button'
import { UI_TIMING } from '@/constants/gameConstants'
import type { GameStatusProps } from './GameStatus.types'

/**
 * GameStatus component that displays failure state only as a full-screen overlay
 * Shows "Try again" message with retry and reset buttons when the player fails
 * Renders as an overlay covering the entire screen with yellow background at 80% opacity
 * Includes a delay to allow players to see the button's fail state before showing the overlay
 * Features a smooth fade-in animation using framer-motion
 */
export const GameStatus: React.FC<GameStatusProps> = ({ 
  gameState, 
  onRetry, 
  onResetGame, 
  className 
}) => {
  const { currentState } = gameState
  const [showOverlay, setShowOverlay] = useState(false)

  // Handle timing for showing the overlay after button fail state
  useEffect(() => {
    if (currentState === 'FAILURE') {
      console.log('GameStatus: Failure state detected, scheduling overlay display') // Debug log
      
      // Delay showing the overlay to allow players to see the button's fail state
      const timer = setTimeout(() => {
        setShowOverlay(true)
        console.log('GameStatus: Showing failure overlay after delay') // Debug log
      }, UI_TIMING.buttonStateDisplayDuration)

      return () => clearTimeout(timer)
    } else {
      // Reset overlay state when not in failure state
      setShowOverlay(false)
    }
  }, [currentState])

  return (
    <AnimatePresence>
      {currentState === 'FAILURE' && showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`fixed inset-0 bg-custom-golden/80 flex items-center justify-center z-50 ${className}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            className="text-center"
          >
            <h2 className="font-heading text-[26px] text-black">
              Try again
            </h2>
            <div className="mt-4 space-x-2">
              <Button onClick={onRetry} className="px-6 py-4">
                <span className="font-interactive">Retry</span>
              </Button>
              <Button onClick={onResetGame} className="px-6 py-4">
                <span className="font-interactive">Reset Game</span>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 