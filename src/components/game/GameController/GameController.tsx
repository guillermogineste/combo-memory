import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { PreGame } from '../GameFlow/PreGame'
import { GamePlay } from '../GameFlow/GamePlay'
import { GameComplete } from '../GameFlow/GameComplete'
import { useGameState } from '@/hooks/useGameState'
import { useSequencePlayback } from '@/hooks/useSequencePlayback'
import { useGameFlow } from '../../../hooks/useGameFlow'
import { UI_TIMING } from '@/constants/gameConstants'
import type { GameControllerProps } from './GameController.types'
import type { GameMode, DifficultyLevel } from '@/types/Game'

/**
 * GameController component that manages the entire Simon Says game flow
 * Coordinates game state management and sequence playback
 * Now uses three distinct components for different game phases
 */
export const GameController: React.FC<GameControllerProps> = ({ className, onDebugUpdate }) => {
  const gameState = useGameState()
  const [highlightedButton, setHighlightedButton] = useState<number | null>(null)

  // Get current sequence buttons for playback - memoized to prevent infinite loops
  // Note: We intentionally include specific nested dependencies instead of the full gameState object
  // to prevent unnecessary re-renders. Including gameState would cause problematic re-renders.
  const currentSequenceButtons = useMemo(() => {
    const buttons = gameState.getCurrentSequenceButtons()
    console.log('Current sequence buttons (memoized):', buttons) // Debug log
    return buttons
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gameState.gameState.currentSequence?.id,
    gameState.gameState.gameMode,
    gameState.gameState.currentAdditiveLevel
  ])

  // Auto-clear button states after success/fail
  useEffect(() => {
    if (gameState.gameState.lastButtonResult === 'success' || gameState.gameState.lastButtonResult === 'fail') {
      console.log('Button result detected, clearing states in 1 second:', gameState.gameState.lastButtonResult) // Debug log
      const timer = setTimeout(() => {
        gameState.clearButtonStates()
      }, UI_TIMING.buttonStateDisplayDuration) // Use shorter duration for button state clearing

      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.gameState.lastButtonResult, gameState.clearButtonStates])

  // Handle sequence completion
  const handleSequenceComplete = useCallback(() => {
    gameState.dispatch({ type: 'SEQUENCE_COMPLETE' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.dispatch])

  // Handle button highlighting during sequence playback
  const handleButtonHighlight = useCallback((buttonNumber: number | null) => {
    setHighlightedButton(buttonNumber)
  }, [])

  // Initialize sequence playback
  useSequencePlayback({
    sequence: gameState.gameState.currentSequence,
    isPlaying: gameState.gameState.currentState === 'SHOWING_SEQUENCE',
    onSequenceComplete: handleSequenceComplete,
    onButtonHighlight: handleButtonHighlight,
    customButtons: gameState.gameState.gameMode === 'CHAIN_COMBINATION_MODE' ? currentSequenceButtons : undefined
  })

  // Handle game flow automation (auto-progress, input checking, etc.)
  useGameFlow(gameState)

  // Handle user button clicks
  const handleButtonClick = useCallback((buttonNumber: number) => {
    if (gameState.gameState.currentState !== 'WAITING_FOR_INPUT') {
      console.log('Button click ignored - not waiting for input') // Debug log
      return
    }

    console.log('Button clicked:', buttonNumber) // Debug log
    gameState.addUserInput(buttonNumber)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.gameState.currentState, gameState.addUserInput])

  // Handle game mode selection and start game combined
  const handleStartGameWithMode = useCallback((mode: GameMode, difficulty: DifficultyLevel) => {
    console.log('Starting game with mode:', mode, 'difficulty:', difficulty) // Debug log
    gameState.startGameWithMode(mode, difficulty)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.startGameWithMode])

  // Handle retry button
  const handleRetry = useCallback(() => {
    console.log('Retrying current sequence') // Debug log
    gameState.retrySequence()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.retrySequence])

  // Handle reset game
  const handleResetGame = useCallback(() => {
    console.log('Resetting game') // Debug log
    gameState.resetGame()
    setHighlightedButton(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.resetGame])

  // Update debug panel data
  useEffect(() => {
    if (onDebugUpdate) {
      onDebugUpdate({
        gameState: gameState.gameState,
        currentSequenceButtons
      })
    }
  }, [gameState.gameState, currentSequenceButtons, onDebugUpdate])

  console.log('GameController: Current game state:', gameState.gameState.currentState) // Debug log

  /**
   * Render the appropriate game component based on current state
   * Centralizes component switching logic for better maintainability
   */
  const renderGameComponent = () => {
    switch (gameState.gameState.currentState) {
      case 'GAME_NOT_STARTED':
        return (
          <PreGame
            gameState={gameState.gameState}
            onStartGameWithMode={handleStartGameWithMode}
          />
        )
      
      case 'SHOWING_SEQUENCE':
      case 'WAITING_FOR_INPUT':
      case 'SUCCESS':
      case 'FAILURE':
        return (
          <GamePlay
            gameState={gameState.gameState}
            onButtonClick={handleButtonClick}
            onRetry={handleRetry}
            onResetGame={handleResetGame}
            highlightedButton={highlightedButton}
          />
        )
      
      case 'GAME_COMPLETE':
        return (
          <GameComplete
            gameState={gameState.gameState}
            onResetGame={handleResetGame}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Main Game Area - Full height, centered content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {renderGameComponent()}
      </div>
    </div>
  )
} 