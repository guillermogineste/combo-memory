import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { GameBoard } from './ui/GameBoard'
import { GameHeader } from './ui/GameHeader'
import { GameModeSelector } from './ui/GameModeSelector'
import { GameStatus } from './ui/GameStatus'
import { useGameState } from '@/hooks/useGameState'
import { useSequencePlayback } from '@/hooks/useSequencePlayback'
import { useGameFlow } from '../hooks/useGameFlow'
import { UI_TIMING } from '@/constants/gameConstants'
import type { GameMode, GameStateData } from '@/types/Game'

export interface GameControllerProps {
  className?: string
  onDebugUpdate?: (data: { gameState: GameStateData; currentSequenceButtons: number[] }) => void
}

/**
 * GameController component that manages the entire Simon Says game flow
 * Coordinates game state management and sequence playback
 */
export const GameController: React.FC<GameControllerProps> = ({ className, onDebugUpdate }) => {
  const gameState = useGameState()
  const [highlightedButton, setHighlightedButton] = useState<number | null>(null)

  // Get current sequence buttons for playback - memoized to prevent infinite loops
  const currentSequenceButtons = useMemo(() => {
    const buttons = gameState.getCurrentSequenceButtons()
    console.log('Current sequence buttons (memoized):', buttons) // Debug log
    return buttons
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
  }, [gameState.gameState.lastButtonResult, gameState.clearButtonStates])

  // Handle sequence completion
  const handleSequenceComplete = useCallback(() => {
    gameState.dispatch({ type: 'SEQUENCE_COMPLETE' })
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
  }, [gameState.gameState.currentState, gameState.addUserInput])

  // Handle game mode selection
  const handleGameModeChange = useCallback((mode: GameMode) => {
    console.log('Game mode changed to:', mode) // Debug log
    gameState.setGameMode(mode)
    gameState.resetGame()
  }, [gameState.setGameMode, gameState.resetGame])

  // Handle start game button
  const handleStartGame = useCallback(() => {
    if (!gameState.gameState.currentSequence) {
      console.log('Starting new game with random sequences') // Debug log
      gameState.startGameWithRandomSequences()
    } else {
      console.log('Continuing current game') // Debug log
      gameState.startSequence(gameState.gameState.currentSequenceIndex)
    }
  }, [gameState.gameState.currentSequence, gameState.gameState.currentSequenceIndex, gameState.startGameWithRandomSequences, gameState.startSequence])

  // Handle retry button
  const handleRetry = useCallback(() => {
    console.log('Retrying current sequence') // Debug log
    gameState.retrySequence()
  }, [gameState.retrySequence])

  // Handle reset game
  const handleResetGame = useCallback(() => {
    console.log('Resetting game') // Debug log
    gameState.resetGame()
    setHighlightedButton(null)
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

  return (
    <div className={`flex flex-col items-center space-y-8 ${className}`}>
      {/* Game Header */}
      <GameHeader gameState={gameState.gameState} />

      {/* Game Mode Selection */}
      <GameModeSelector 
        gameState={gameState.gameState} 
        onGameModeChange={handleGameModeChange}
      />

      {/* Game Status */}
      <GameStatus 
        gameState={gameState.gameState}
        onStartGame={handleStartGame}
        onRetry={handleRetry}
        onResetGame={handleResetGame}
      />

      {/* Game Board */}
      <GameBoard
        onButtonClick={handleButtonClick}
        gameState={gameState.gameState.currentState}
        highlightedButton={highlightedButton}
        lastPressedButton={gameState.gameState.lastPressedButton}
        lastButtonResult={gameState.gameState.lastButtonResult}
      />
    </div>
  )
} 