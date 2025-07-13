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
 * Replaces the separate game mode selector and start game button
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
   * Handle quick mode button click
   * Sets game mode to QUICK_MODE and starts the game
   */
  const handleQuickModeClick = () => {
    console.log('Starting Quick Mode game') // Debug log
    onStartGameWithMode('QUICK_MODE')
  }

  /**
   * Handle chain combination mode button click  
   * Sets game mode to CHAIN_COMBINATION_MODE and starts the game
   */
  const handleChainModeClick = () => {
    console.log('Starting Chain Combination Mode game') // Debug log
    onStartGameWithMode('CHAIN_COMBINATION_MODE')
  }

  // Button styles matching the existing game design
  const quickModeButtonStyles = "bg-custom-orange hover:bg-custom-orange/90 text-black border-[3px] border-black border-b-[8px] min-w-[200px] h-[60px] text-lg font-bold"
  const chainModeButtonStyles = "bg-custom-yellow-light hover:bg-custom-yellow text-black border-[3px] border-black border-b-[8px] min-w-[200px] h-[60px] text-lg font-bold"

  return (
    <div className={`flex flex-col items-center space-y-6 ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-2">Choose Game Mode</h2>
      
      <div className="flex flex-col space-y-4">
        <div className="text-center">
          <Button 
            onClick={handleQuickModeClick} 
            className={quickModeButtonStyles}
          >
            🚀 Quick Mode
          </Button>
          <p className="text-sm text-slate-400 mt-2 max-w-[200px]">
            Play short sequences one after another
          </p>
        </div>
        
        <div className="text-center">
          <Button 
            onClick={handleChainModeClick} 
            className={chainModeButtonStyles}
          >
            🔗 Chain Combination Mode
          </Button>
          <p className="text-sm text-slate-400 mt-2 max-w-[200px]">
            Build long sequences incrementally by groups
          </p>
        </div>
      </div>
    </div>
  )
} 