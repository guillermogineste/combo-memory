import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { GameBoard } from './ui/GameBoard'
import { GameHeader } from './ui/GameHeader'
import { GameModeSelector } from './ui/GameModeSelector'
import { GameStatus } from './ui/GameStatus'
import { useGameState } from '@/hooks/useGameState'
import { useSequencePlayback } from '@/hooks/useSequencePlayback'
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
  const {
    gameState,
    dispatch,
    setGameMode,
    startSequence,
    startGameWithRandomSequences,
    addUserInput,
    checkUserInput,
    nextSequence,
    retrySequence,
    resetGame
  } = useGameState()

  const [highlightedButton, setHighlightedButton] = useState<number | null>(null)

  // Handle sequence completion
  const handleSequenceComplete = useCallback(() => {
    dispatch({ type: 'SEQUENCE_COMPLETE' })
  }, [dispatch])

  // Handle button highlighting during sequence playback
  const handleButtonHighlight = useCallback((buttonNumber: number | null) => {
    setHighlightedButton(buttonNumber)
  }, [])

  // Get current sequence buttons for chain combination mode - MEMOIZED to prevent infinite loops
  const currentSequenceButtons = useMemo(() => {
    if (!gameState.currentSequence) return []
    
    if (gameState.gameMode === 'QUICK_MODE') {
      return gameState.currentSequence.sequence as number[]
    }
    
    // For chain combination mode, build cumulative sequence
    const groups = gameState.currentSequence.sequence as number[][]
    const buttonsToPlay: number[] = []
    
    // Add all buttons from groups 0 to current level
    for (let i = 0; i <= gameState.currentAdditiveLevel && i < groups.length; i++) {
      buttonsToPlay.push(...groups[i])
    }
    
    console.log('Chain combination mode buttons:', buttonsToPlay, 'Level:', gameState.currentAdditiveLevel + 1) // Debug log
    return buttonsToPlay
  }, [
    gameState.currentSequence,
    gameState.gameMode,
    gameState.currentAdditiveLevel
  ])

  // Initialize sequence playback hook
  useSequencePlayback({
    sequence: gameState.currentSequence,
    isPlaying: gameState.currentState === 'SHOWING_SEQUENCE',
    onSequenceComplete: handleSequenceComplete,
    onButtonHighlight: handleButtonHighlight,
    customButtons: gameState.gameMode === 'CHAIN_COMBINATION_MODE' ? currentSequenceButtons : undefined
  })

  // Handle user button clicks
  const handleButtonClick = useCallback((buttonNumber: number) => {
    if (gameState.currentState !== 'WAITING_FOR_INPUT') {
      return
    }

    addUserInput(buttonNumber)
  }, [gameState.currentState, addUserInput])

  // Check user input whenever it changes
  useEffect(() => {
    if (gameState.currentState === 'WAITING_FOR_INPUT' && 
        gameState.userInput.length > 0) {
      checkUserInput()
    }
  }, [gameState.userInput, gameState.currentState, checkUserInput])

  // Auto-progress after success
  useEffect(() => {
    if (gameState.currentState === 'SUCCESS') {
      const timer = setTimeout(() => {
        nextSequence()
      }, UI_TIMING.successDelay)

      return () => clearTimeout(timer)
    }
  }, [gameState.currentState, nextSequence])

  // Auto-start next sequence after progression or initial game start
  useEffect(() => {
    if (gameState.currentState === 'IDLE' && gameState.currentSequence) {
      // Check if we should auto-start:
      // 1. We've progressed to a new sequence/level (not first sequence/level)
      // 2. We just started a new game with random sequences (first sequence, but sequences array is populated)
      const shouldAutoStart = (gameState.currentSequenceIndex > 0 || gameState.currentAdditiveLevel > 0) ||
                             (gameState.currentSequenceIndex === 0 && gameState.currentAdditiveLevel === 0 && gameState.sequences.length > 0)
      
      if (shouldAutoStart) {
        console.log('Auto-start triggered - Level:', gameState.currentAdditiveLevel, 'Sequence:', gameState.currentSequenceIndex) // Debug log
        
        const timer = setTimeout(() => {
          startSequence(gameState.currentSequenceIndex)
        }, UI_TIMING.autoStartDelay)

        return () => clearTimeout(timer)
      }
    }
  }, [gameState.currentState, gameState.currentSequence, gameState.currentSequenceIndex, gameState.currentAdditiveLevel, gameState.sequences.length, startSequence])

  // Update debug panel data
  useEffect(() => {
    if (onDebugUpdate) {
      onDebugUpdate({
        gameState,
        currentSequenceButtons
      })
    }
  }, [gameState, currentSequenceButtons, onDebugUpdate])

  // Handle game mode selection
  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode)
    // Reset game when mode changes
    resetGame()
  }

  // Handle start game button
  const handleStartGame = () => {
    if (!gameState.currentSequence) {
      // Starting a new game - select random sequences
      startGameWithRandomSequences()
    } else {
      // Continue with current sequence
      startSequence(gameState.currentSequenceIndex)
    }
  }

  // Handle retry button
  const handleRetry = () => {
    retrySequence()
    setTimeout(() => {
      startSequence(gameState.currentSequenceIndex)
    }, UI_TIMING.autoStartDelay)
  }

  // Handle reset game
  const handleResetGame = () => {
    resetGame()
    setHighlightedButton(null)
  }



  return (
    <div className={`flex flex-col items-center space-y-8 ${className}`}>
      {/* Game Header */}
      <GameHeader gameState={gameState} />

      {/* Game Mode Selection */}
      <GameModeSelector 
        gameState={gameState} 
        onGameModeChange={handleGameModeChange}
      />

      {/* Game Status */}
      <GameStatus 
        gameState={gameState}
        onStartGame={handleStartGame}
        onRetry={handleRetry}
        onResetGame={handleResetGame}
      />

      {/* Game Board */}
      <GameBoard
        onButtonClick={handleButtonClick}
        gameState={gameState.currentState}
        highlightedButton={highlightedButton}
      />

    </div>
  )
} 