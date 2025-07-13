import React from 'react'
import { GameModeStartButtons } from './GameModeStartButtons'
import type { GameStateData, GameMode } from '@/types/Game'

export interface PreGameComponentProps {
  gameState: GameStateData
  onStartGameWithMode: (mode: GameMode) => void
  className?: string
}

/**
 * PreGameComponent that displays before the game starts
 * Shows the game header and mode selection buttons, but no game board
 */
export const PreGameComponent: React.FC<PreGameComponentProps> = ({ 
  gameState, 
  onStartGameWithMode, 
  className 
}) => {
  // Only render if game hasn't started
  if (gameState.currentState !== 'GAME_NOT_STARTED') {
    return null
  }

  console.log('PreGameComponent: Rendering pre-game interface') // Debug log

  return (
    <div className={`flex flex-col items-center space-y-8 ${className}`}>
      {/* Game Mode Selection and Start Buttons */}
      <GameModeStartButtons 
        gameState={gameState} 
        onStartGameWithMode={onStartGameWithMode}
      />

      {/* Welcome message */}
      <div className="text-center text-slate-300 max-w-md">
        <p className="text-lg mb-2">Welcome to Simon Says!</p>
        <p className="text-sm">
          Choose a game mode above to begin your memory challenge.
        </p>
      </div>
    </div>
  )
} 