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
 * Shows the simplified game mode selection with horizontal buttons
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
    <div className={`flex flex-col items-center ${className}`}>
      <GameModeStartButtons 
        gameState={gameState} 
        onStartGameWithMode={onStartGameWithMode}
      />
    </div>
  )
} 