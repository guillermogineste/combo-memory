import React from 'react'
import type { DebugPanelProps } from './DebugPanel.types'

/**
 * Debug panel component that displays game state information
 * Positioned as a floating card at the bottom right of the screen
 */
export const DebugPanel: React.FC<DebugPanelProps> = ({ 
  gameState, 
  currentSequenceButtons 
}) => {
  return (
    <div className="absolute bottom-4 right-4 bg-transparent border border-black rounded-lg p-3 z-50 min-w-[240px]">
      <div className="text-center text-xs text-black space-y-1">
        <div className="text-black font-semibold mb-2 border-b border-black pb-1">
          Debug Info
        </div>
        <p>
          <span className="text-black">State:</span>{' '}
          <span className="text-black">{gameState.currentState}</span>
        </p>
        <p>
          <span className="text-black">User Input:</span>{' '}
          <span className="text-black">[{gameState.userInput.join(', ')}]</span>
        </p>
        {gameState.currentSequence && (
          <p>
            <span className="text-black">Expected:</span>{' '}
            <span className="text-black">[{currentSequenceButtons.join(', ')}]</span>
          </p>
        )}
        {gameState.gameMode === 'CHAIN_COMBINATION_MODE' && (
          <p>
            <span className="text-black">Level:</span>{' '}
            <span className="text-black">
              {gameState.currentAdditiveLevel + 1}/{gameState.maxAdditiveLevel + 1}
            </span>
          </p>
        )}
        <div className="pt-1 border-t border-black">
          <p>
            <span className="text-black">Mode:</span>{' '}
            <span className="text-black">{gameState.gameMode}</span>
          </p>
          <p>
            <span className="text-black">Difficulty:</span>{' '}
            <span className="text-black">{gameState.difficulty}</span>
          </p>
          <p>
            <span className="text-black">Score:</span>{' '}
            <span className="text-black">{gameState.score}</span>
          </p>
        </div>
      </div>
    </div>
  )
} 