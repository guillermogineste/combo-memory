import React from 'react'
import { GameHeader } from './GameHeader'
import { GameStatus } from './GameStatus'
import { GameBoard } from './GameBoard'
import type { GameStateData, GameState } from '@/types/Game'

export interface GamePlayComponentProps {
  gameState: GameStateData
  onButtonClick: (buttonNumber: number) => void
  onRetry: () => void
  onResetGame: () => void
  highlightedButton: number | null
  className?: string
}

/**
 * GamePlayComponent that displays during active game play
 * Shows the game header, status, and game board with interactive buttons
 */
export const GamePlayComponent: React.FC<GamePlayComponentProps> = ({ 
  gameState, 
  onButtonClick,
  onRetry,
  onResetGame,
  highlightedButton,
  className 
}) => {
  // Only render during active game states
  const activeGameStates: GameState[] = ['SHOWING_SEQUENCE', 'WAITING_FOR_INPUT', 'SUCCESS', 'FAILURE']
  
  if (!activeGameStates.includes(gameState.currentState)) {
    return null
  }

  console.log('GamePlayComponent: Rendering game play interface for state:', gameState.currentState) // Debug log

  return (
    <div className={`flex flex-col items-center space-y-8 ${className}`}>
      {/* Game Header */}
      <GameHeader gameState={gameState} />

      {/* Game Status */}
      <GameStatus 
        gameState={gameState}
        onRetry={onRetry}
        onResetGame={onResetGame}
      />

      {/* Game Board */}
      <GameBoard
        onButtonClick={onButtonClick}
        gameState={gameState.currentState}
        highlightedButton={highlightedButton}
        lastPressedButton={gameState.lastPressedButton}
        lastButtonResult={gameState.lastButtonResult}
      />
    </div>
  )
} 