import React from 'react'
import type { GameMode, GameStateData } from '@/types/Game'

export interface GameModeSelectorProps {
  gameState: GameStateData
  onGameModeChange: (mode: GameMode) => void
  className?: string
}

/**
 * GameModeSelector component that displays the game mode selection interface
 * Only shows when game is in IDLE state and no current sequence is active
 */
export const GameModeSelector: React.FC<GameModeSelectorProps> = ({ 
  gameState, 
  onGameModeChange, 
  className 
}) => {
  // Only show mode selector when game is idle and no current sequence
  if (gameState.currentState !== 'IDLE' || gameState.currentSequence) {
    return null
  }

  /**
   * Handle game mode selection change
   * @param e - Select element change event
   */
  const handleGameModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mode = e.target.value as GameMode
    onGameModeChange(mode)
  }

  /**
   * Get description text for the selected game mode
   * @returns Description string for current mode
   */
  const getModeDescription = (): string => {
    switch (gameState.gameMode) {
      case 'QUICK_MODE':
        return 'Play short sequences one after another'
      case 'CHAIN_COMBINATION_MODE':
        return 'Build long sequences incrementally by groups'
      default:
        return ''
    }
  }

  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-xl font-semibold text-white mb-4">Select Game Mode</h2>
      <div className="flex flex-col items-center space-y-2">
        <select
          value={gameState.gameMode}
          onChange={handleGameModeChange}
          className="px-4 py-2 bg-slate-700 text-white rounded-md border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
        >
          <option value="QUICK_MODE">Quick Mode</option>
          <option value="CHAIN_COMBINATION_MODE">Chain Combination Mode</option>
        </select>
        <div className="text-sm text-slate-400 text-center max-w-md">
          {getModeDescription()}
        </div>
      </div>
    </div>
  )
} 