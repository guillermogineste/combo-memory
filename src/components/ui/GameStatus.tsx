import React from 'react'
import { Button } from './button'
import type { GameStateData } from '@/types/Game'

export interface GameStatusProps {
  gameState: GameStateData
  onRetry: () => void
  onResetGame: () => void
  className?: string
}

/**
 * GameStatus component that displays success or failure states
 * Shows "Well done" for success and "Try again" with buttons for failure
 */
export const GameStatus: React.FC<GameStatusProps> = ({ 
  gameState, 
  onRetry, 
  onResetGame, 
  className 
}) => {
  // Custom button styles for failure state buttons
  const retryButtonStyles = "bg-custom-yellow-light hover:bg-custom-yellow text-black border-[3px] border-black border-b-[8px]"
  const resetButtonStyles = "bg-white hover:bg-white/90 text-black border-[3px] border-black border-b-[8px]"

  const { currentState } = gameState

  const renderStatusContent = () => {
    switch (currentState) {
      case 'SUCCESS':
        return (
          <div className="text-center">
            <p className="text-black font-bold text-lg">
              Well done
            </p>
          </div>
        )
      
      case 'FAILURE':
        return (
          <div className="text-center">
            <p className="text-black font-bold text-lg">
              Try again
            </p>
            <div className="mt-4 space-x-2">
              <Button onClick={onRetry} className={retryButtonStyles}>
                Retry
              </Button>
              <Button onClick={onResetGame} className={resetButtonStyles}>
                Reset Game
              </Button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className={`min-h-[100px] flex items-center justify-center ${className}`}>
      {renderStatusContent()}
    </div>
  )
} 