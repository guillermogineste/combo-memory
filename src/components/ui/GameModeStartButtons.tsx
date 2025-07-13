import React from 'react'
import { Button } from './button'
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

  // Button styles matching the existing game design
  const simpleModeButtonStyles = "bg-custom-orange hover:bg-custom-orange/90 text-black border-[3px] border-black border-b-[8px] min-w-[200px] h-[80px] text-lg font-bold flex flex-col items-center justify-center"
  const chainModeButtonStyles = "bg-custom-yellow-light hover:bg-custom-yellow text-black border-[3px] border-black border-b-[8px] min-w-[200px] h-[80px] text-lg font-bold flex flex-col items-center justify-center"

  return (
    <div className={`flex flex-col items-center space-y-6 ${className}`}>
      <h2 className="text-xl font-bold text-black">Select game mode</h2>
      
      <div className="flex space-x-6">
        <Button 
          onClick={handleSimpleModeClick} 
          className={simpleModeButtonStyles}
        >
          <span className="text-lg font-bold">Simple</span>
          <span className="text-sm font-normal">Short simple sequences</span>
        </Button>
        
        <Button 
          onClick={handleChainModeClick} 
          className={chainModeButtonStyles}
        >
          <span className="text-lg font-bold">Chain</span>
          <span className="text-sm font-normal">Chain long sequences</span>
        </Button>
      </div>
    </div>
  )
} 