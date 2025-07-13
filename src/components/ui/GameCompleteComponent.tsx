import React from 'react'
import { GameStatus } from './GameStatus'
import type { GameStateData } from '@/types/Game'

export interface GameCompleteComponentProps {
  gameState: GameStateData
  onRetry: () => void
  onResetGame: () => void
  className?: string
}

/**
 * GameCompleteComponent that displays when the game is complete
 * Shows the game header and completion status with play again option, but no game board
 */
export const GameCompleteComponent: React.FC<GameCompleteComponentProps> = ({ 
  gameState, 
  onRetry,
  onResetGame,
  className 
}) => {
  // Only render when game is complete
  if (gameState.currentState !== 'GAME_COMPLETE') {
    return null
  }

  console.log('GameCompleteComponent: Rendering game complete interface') // Debug log

  return (
    <div className={`flex flex-col items-center space-y-8 ${className}`}>
      {/* Game Status - shows completion message and play again button */}
      <GameStatus 
        gameState={gameState}
        onRetry={onRetry}
        onResetGame={onResetGame}
      />

      {/* Additional completion message */}
      <div className="text-center text-slate-300 max-w-md">
        <p className="text-lg mb-2">🎉 Congratulations!</p>
        <p className="text-sm">
          You've completed all sequences in {gameState.gameMode.replace('_', ' ').toLowerCase()}.
        </p>
        <p className="text-sm mt-2">
          Ready for another challenge?
        </p>
      </div>
    </div>
  )
} 