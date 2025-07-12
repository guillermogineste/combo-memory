import React from 'react'
import { Button } from './button'
import type { GameStateData } from '@/types/Game'

export interface GameStatusProps {
  gameState: GameStateData
  onStartGame: () => void
  onRetry: () => void
  onResetGame: () => void
  className?: string
}

/**
 * GameStatus component that displays the current game status and relevant actions
 * Handles all game states: GAME_NOT_STARTED, SHOWING_SEQUENCE, WAITING_FOR_INPUT, SUCCESS, FAILURE, GAME_COMPLETE
 */
export const GameStatus: React.FC<GameStatusProps> = ({ 
  gameState, 
  onStartGame, 
  onRetry, 
  onResetGame, 
  className 
}) => {


  /**
   * Get next progression message for success state
   * @returns Next step message
   */
  const getNextProgressionMessage = (): string => {
    if (gameState.gameMode === 'CHAIN_COMBINATION_MODE' && gameState.currentAdditiveLevel < gameState.maxAdditiveLevel) {
      return 'Moving to next level...'
    }
    return 'Moving to next sequence...'
  }

  // Custom button styles for status buttons
  const statusButtonStyles = "bg-custom-orange hover:bg-custom-orange/90 text-black border-[3px] border-black border-b-[8px]"
  const retryButtonStyles = "bg-custom-yellow-light hover:bg-custom-yellow text-black border-[3px] border-black border-b-[8px]"
  const resetButtonStyles = "bg-white hover:bg-white/90 text-black border-[3px] border-black border-b-[8px]"

  const { currentState, score, errorMessage } = gameState

  const renderStatusContent = () => {
    switch (currentState) {
      case 'GAME_NOT_STARTED':
        return (
          <div className="text-center">
            <Button onClick={onStartGame} className={statusButtonStyles}>
              Start Game
            </Button>
          </div>
        )
      
      case 'SHOWING_SEQUENCE':
        return (
          <div className="text-center">
          </div>
        )
      
      case 'WAITING_FOR_INPUT':
        return (
          <div className="text-center">
          </div>
        )
      
      case 'SUCCESS':
        return (
          <div className="text-center">
            <p className="text-green-400 font-bold text-lg">
              🎉 Perfect! Well done!
            </p>
            <p className="text-slate-400 text-sm mt-2">
              {getNextProgressionMessage()}
            </p>
          </div>
        )
      
      case 'FAILURE':
        return (
          <div className="text-center">
            <p className="text-red-400 font-bold text-lg">
              ❌ Incorrect sequence!
            </p>
            <p className="text-slate-400 text-sm mt-2">
              {errorMessage || 'Try again'}
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
      
      case 'GAME_COMPLETE':
        return (
          <div className="text-center">
            <p className="text-purple-400 font-bold text-2xl">
              🏆 Game Complete!
            </p>
            <p className="text-slate-400 text-lg mt-2">
              Final Score: {score}
            </p>
            <Button onClick={onResetGame} className={statusButtonStyles}>
              Play Again
            </Button>
          </div>
        )
      
      default:
        return (
          <div className="text-center">
            <p className="text-slate-400">Loading...</p>
          </div>
        )
    }
  }

  return (
    <div className={`min-h-[100px] flex items-center justify-center ${className}`}>
      {renderStatusContent()}
    </div>
  )
} 