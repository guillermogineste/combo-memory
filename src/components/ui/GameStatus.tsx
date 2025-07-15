import React, { useState, useEffect } from 'react'
import { UIButton } from './UIButton'
import { UI_TIMING } from '@/constants/gameConstants'
import type { GameStateData } from '@/types/Game'

export interface GameStatusProps {
  gameState: GameStateData
  onRetry: () => void
  onResetGame: () => void
  className?: string
}

/**
 * GameStatus component that displays failure state only as a full-screen overlay
 * Shows "Try again" message with retry and reset buttons when the player fails
 * Renders as an overlay covering the entire screen with yellow background at 80% opacity
 * Includes a delay to allow players to see the button's fail state before showing the overlay
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

  // Only render for failure state AND after the delay
  if (currentState !== 'FAILURE' || !showOverlay) {
    return null
  }

  return (
    <div className={`fixed inset-0 bg-custom-golden/80 flex items-center justify-center z-50 ${className}`}>
      <div className="text-center">
        <p className="text-black font-bold text-lg">
          Try again
        </p>
        <div className="mt-4 space-x-2">
          <UIButton onClick={onRetry}>
            Retry
          </UIButton>
          <UIButton onClick={onResetGame}>
            Reset Game
          </UIButton>
        </div>
      </div>
    </div>
  )
} 