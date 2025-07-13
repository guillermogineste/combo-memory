import React from 'react'
import { UIButton } from './UIButton'
import type { GameMode, GameStateData } from '@/types/Game'

export interface GameModeStartButtonsProps {
  gameState: GameStateData
  onStartGameWithMode: (mode: GameMode) => void
  className?: string
}

/**
 * GameModeStartButtons component that provides two buttons to directly start games in different modes
 * Simplified version with horizontal layout and descriptions inside buttons
 */
export const GameModeStartButtons: React.FC<GameModeStartButtonsProps> = ({ 
  gameState, 
  onStartGameWithMode, 
  className 
}) => {
  // Only show mode buttons when game hasn't started
  if (gameState.currentState !== 'GAME_NOT_STARTED') {
    return null
  }

  /**
   * Handle simple mode button click
   * Sets game mode to QUICK_MODE and starts the game
   */
  const handleSimpleModeClick = () => {
    console.log('Starting Simple Mode game') // Debug log
    onStartGameWithMode('QUICK_MODE')
  }

  /**
   * Handle chain mode button click  
   * Sets game mode to CHAIN_COMBINATION_MODE and starts the game
   */
  const handleChainModeClick = () => {
    console.log('Starting Chain Mode game') // Debug log
    onStartGameWithMode('CHAIN_COMBINATION_MODE')
  }

  return (
    <div className={`flex flex-col items-center space-y-6 ${className}`}>
      <h2 className="text-xl font-bold text-black">Select game mode</h2>
      
      <div className="flex space-x-6">
        <UIButton 
          onClick={handleSimpleModeClick} 
          size="large"
        >
          <span className="text-lg font-bold">Simple</span>
          <span className="text-sm font-normal">Short simple sequences</span>
        </UIButton>
        
        <UIButton 
          onClick={handleChainModeClick} 
          size="large"
        >
          <span className="text-lg font-bold">Chain</span>
          <span className="text-sm font-normal">Chain long sequences</span>
        </UIButton>
      </div>
    </div>
  )
} 