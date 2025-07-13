import React from 'react'
import { UIButton } from './UIButton'
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
              <UIButton onClick={onRetry}>
                Retry
              </UIButton>
              <UIButton onClick={onResetGame}>
                Reset Game
              </UIButton>
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