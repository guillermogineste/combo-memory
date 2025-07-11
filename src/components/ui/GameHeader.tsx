import React from 'react'
import type { GameStateData } from '@/types/Game'

export interface GameHeaderProps {
  gameState: GameStateData
  className?: string
}

/**
 * GameHeader component that displays the game title and current game information
 * Shows sequence progress, level (for chain combination mode), score, and current mode
 */
export const GameHeader: React.FC<GameHeaderProps> = ({ gameState, className }) => {
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

  return (
    <div className={`text-center ${className}`}>
      <h1 className="text-4xl font-bold text-white mb-2">Simon Says</h1>
      <div className="flex items-center justify-center space-x-6 text-sm">
        <span className="text-slate-300">
          Sequence: {gameState.currentSequenceIndex + 1}/{gameState.sequences.length}
        </span>
        {gameState.gameMode === 'CHAIN_COMBINATION_MODE' && gameState.currentSequence && (
          <span className="text-green-400">
            {getCurrentLevelInfo()}
          </span>
        )}
        <span className="text-yellow-400">
          Score: {gameState.score}
        </span>
      </div>
    </div>
  )
} 