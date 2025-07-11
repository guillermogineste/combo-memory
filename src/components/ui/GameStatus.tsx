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
 * Handles all game states: IDLE, SHOWING_SEQUENCE, WAITING_FOR_INPUT, SUCCESS, FAILURE, GAME_COMPLETE
 */
export const GameStatus: React.FC<GameStatusProps> = ({ 
  gameState, 
  onStartGame, 
  onRetry, 
  onResetGame, 
  className 
}) => {
  /**
   * Get current level info for chain combination mode
   * @returns Level information string or empty string
   */
  const getCurrentLevelInfo = (): string => {
    if (gameState.gameMode === 'CHAIN_COMBINATION_MODE' && gameState.currentSequence) {
      return `Level ${gameState.currentAdditiveLevel + 1}/${gameState.maxAdditiveLevel + 1}`
    }
    return ''
  }

  /**
   * Get current sequence description
   * @returns Sequence description string
   */
  const getCurrentSequenceDescription = (): string => {
    if (gameState.gameMode === 'CHAIN_COMBINATION_MODE' && gameState.currentSequence) {
      return `Sequence ${gameState.currentSequence.id}`
    }
    return `Sequence ${gameState.currentSequence?.id || ''}`
  }

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

  const { currentState, currentSequence, score, errorMessage } = gameState
  const levelInfo = getCurrentLevelInfo()
  const sequenceDescription = getCurrentSequenceDescription()

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
      
      case 'IDLE':
        return (
          <div className="text-center">
            <p className="text-slate-300 mb-4">
              {currentSequence ? (
                <>
                  Ready to play: {sequenceDescription}
                  {levelInfo && <span className="text-yellow-400 ml-2">({levelInfo})</span>}
                </>
              ) : 'Ready to start!'}
            </p>
            <Button onClick={onStartGame} className={statusButtonStyles}>
              {currentSequence ? 'Start Sequence' : 'Start Game'}
            </Button>
          </div>
        )
      
      case 'SHOWING_SEQUENCE':
        return (
          <div className="text-center">
            <p className="text-yellow-400 font-semibold">
              Watch the sequence: {sequenceDescription}
              {levelInfo && <span className="text-slate-300 ml-2">({levelInfo})</span>}
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Memorize the pattern...
            </p>
          </div>
        )
      
      case 'WAITING_FOR_INPUT':
        return (
          <div className="text-center">
            <p className="text-green-400 font-semibold">
              Your turn! Repeat the sequence
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Click the buttons in the correct order
            </p>
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