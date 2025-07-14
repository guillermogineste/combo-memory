import React from 'react'
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
 */
export const GameCompleteComponent: React.FC<GameCompleteComponentProps> = ({ 
  gameState, 
  onResetGame,
  className 
}) => {
  // Only render when game is complete
  if (gameState.currentState !== 'GAME_COMPLETE') {
    return null
  }

  console.log('GameCompleteComponent: Rendering game complete interface') // Debug log

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <p className="text-black font-bold text-lg">
        Well done!
      </p>
      
      <UIButton onClick={onResetGame}>
        Restart
      </UIButton>
    </div>
  )
} 