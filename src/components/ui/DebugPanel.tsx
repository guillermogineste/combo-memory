import React from 'react'
import type { GameStateData } from '@/types/Game'

interface DebugPanelProps {
  gameState: GameStateData
  currentSequenceButtons: number[]
}

/**
 * Debug panel component that displays game state information
 * Positioned as a floating card at the bottom right of the screen
 */
export const DebugPanel: React.FC<DebugPanelProps> = ({ 
  gameState, 
  currentSequenceButtons 
}) => {
  return (
    <div className="absolute bottom-4 right-4 bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg z-50 min-w-[240px]">
      <div className="text-center text-xs text-slate-300 space-y-1">
        <div className="text-slate-400 font-semibold mb-2 border-b border-slate-600 pb-1">
          Debug Info
        </div>
        <p>
          <span className="text-slate-500">State:</span>{' '}
          <span className="text-yellow-400">{gameState.currentState}</span>
        </p>
        <p>
          <span className="text-slate-500">User Input:</span>{' '}
          <span className="text-blue-400">[{gameState.userInput.join(', ')}]</span>
        </p>
        {gameState.currentSequence && (
          <p>
            <span className="text-slate-500">Expected:</span>{' '}
            <span className="text-green-400">[{currentSequenceButtons.join(', ')}]</span>
          </p>
        )}
        {gameState.gameMode === 'CHAIN_COMBINATION_MODE' && (
          <p>
            <span className="text-slate-500">Level:</span>{' '}
            <span className="text-orange-400">
              {gameState.currentAdditiveLevel + 1}/{gameState.maxAdditiveLevel + 1}
            </span>
          </p>
        )}
        <div className="pt-1 border-t border-slate-600">
          <p>
            <span className="text-slate-500">Mode:</span>{' '}
            <span className="text-purple-400">{gameState.gameMode}</span>
          </p>
          <p>
            <span className="text-slate-500">Difficulty:</span>{' '}
            <span className="text-pink-400">{gameState.difficulty}</span>
          </p>
          <p>
            <span className="text-slate-500">Score:</span>{' '}
            <span className="text-yellow-400">{gameState.score}</span>
          </p>
        </div>
      </div>
    </div>
  )
} 