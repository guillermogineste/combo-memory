import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameStatus } from './GameStatus'
import { GameBoard } from './GameBoard'
import { GameProgress } from './GameProgress'
import { UI_TIMING } from '@/constants/gameConstants'
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
 * Features animated entrance for the game board and progress indicator
 * Includes exit animation when game completes
 */
export const GamePlayComponent: React.FC<GamePlayComponentProps> = ({ 
  gameState, 
  onButtonClick,
  onRetry,
  onResetGame,
  highlightedButton,
  className 
}) => {
  const [isExiting, setIsExiting] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  
  // Only render during active game states
  const activeGameStates: GameState[] = ['SHOWING_SEQUENCE', 'WAITING_FOR_INPUT', 'SUCCESS', 'FAILURE']
  
  // Handle component visibility with proper timing
  useEffect(() => {
    if (activeGameStates.includes(gameState.currentState)) {
      // Add delay before showing to allow PreGameComponent to exit
      const timer = setTimeout(() => {
        setShouldRender(true)
      }, 600) // Wait for PreGameComponent exit animation + small buffer
      
      return () => clearTimeout(timer)
    } else {
      setShouldRender(false)
    }
  }, [gameState.currentState])

  // Handle exit animation when game is completing
  useEffect(() => {
    if (gameState.currentState === 'SUCCESS') {
      // Check if this is the last sequence
      const isLastSequence = gameState.currentSequenceIndex >= gameState.sequences.length - 1
      const isLastLevel = gameState.gameMode === 'CHAIN_COMBINATION_MODE' 
        ? gameState.currentAdditiveLevel >= gameState.maxAdditiveLevel
        : true
      
      if (isLastSequence && isLastLevel) {
        console.log('GamePlayComponent: Game completing - scheduling exit animation') // Debug log
        
        // Start exit animation after showing success state
        const exitTimer = setTimeout(() => {
          setIsExiting(true)
        }, UI_TIMING.successDelay - 300) // Start exit animation 300ms before completion
        
        return () => clearTimeout(exitTimer)
      }
    }
    
    // Reset exit state when starting new game
    if (gameState.currentState === 'GAME_NOT_STARTED') {
      setIsExiting(false)
    }
  }, [gameState.currentState, gameState.currentSequenceIndex, gameState.sequences.length, gameState.gameMode, gameState.currentAdditiveLevel, gameState.maxAdditiveLevel])

  // Don't render if not in active game states or not ready to show
  if (!activeGameStates.includes(gameState.currentState) || !shouldRender) {
    return null
  }

  console.log('GamePlayComponent: Rendering game play interface for state:', gameState.currentState) // Debug log

  return (
    <div className={`flex flex-col items-center justify-center space-y-8 w-full ${className}`}>
      {/* Game Status - Overlay component, not animated */}
      <GameStatus 
        gameState={gameState}
        onRetry={onRetry}
        onResetGame={onResetGame}
      />

      {/* Animated Game Board and Progress Container */}
      <AnimatePresence mode="wait">
        {!isExiting && (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center space-y-8"
          >
            {/* Game Board */}
            <GameBoard
              onButtonClick={onButtonClick}
              gameState={gameState.currentState}
              highlightedButton={highlightedButton}
              lastPressedButton={gameState.lastPressedButton}
              lastButtonResult={gameState.lastButtonResult}
            />

            {/* Game Progress */}
            <GameProgress gameState={gameState} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 