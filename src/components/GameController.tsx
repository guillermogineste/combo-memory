import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { GameBoard } from './ui/GameBoard'
import { Button } from './ui/button'
import { useGameState } from '@/hooks/useGameState'
import { useSequencePlayback } from '@/hooks/useSequencePlayback'
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

  // Get current sequence buttons for additive mode - MEMOIZED to prevent infinite loops
  const currentSequenceButtons = useMemo(() => {
    if (!gameState.currentSequence) return []
    
    if (gameState.gameMode === 'NORMAL') {
      return gameState.currentSequence.buttons
    }
    
    // For additive mode, build cumulative sequence
    const groups = gameState.currentSequence.groups || []
    const buttonsToPlay: number[] = []
    
    // Add all buttons from groups 0 to current level
    for (let i = 0; i <= gameState.currentAdditiveLevel && i < groups.length; i++) {
      buttonsToPlay.push(...groups[i].buttons)
    }
    
    console.log('Additive mode buttons:', buttonsToPlay, 'Level:', gameState.currentAdditiveLevel + 1) // Debug log
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
    customButtons: gameState.gameMode === 'ADDITIVE' ? currentSequenceButtons : undefined
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
      }, 1500) // Wait 1.5 seconds before next sequence

      return () => clearTimeout(timer)
    }
  }, [gameState.currentState, nextSequence])

  // Auto-start next sequence after progression
  useEffect(() => {
    if (gameState.currentState === 'IDLE' && 
        gameState.currentSequence && 
        (gameState.currentSequenceIndex > 0 || gameState.currentAdditiveLevel > 0)) {
      // If we're in IDLE state with a sequence and not on the first sequence/level,
      // it means we just progressed to a new sequence/level, so auto-start it
      
      console.log('Auto-start triggered - Level:', gameState.currentAdditiveLevel, 'Sequence:', gameState.currentSequenceIndex) // Debug log
      
      const timer = setTimeout(() => {
        startSequence(gameState.currentSequenceIndex)
      }, 500) // Brief pause before starting

      return () => clearTimeout(timer)
    }
  }, [gameState.currentState, gameState.currentSequence, gameState.currentSequenceIndex, gameState.currentAdditiveLevel, startSequence])

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
  const handleGameModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mode = e.target.value as GameMode
    setGameMode(mode)
    // Reset game when mode changes
    resetGame()
  }

  // Handle start game button
  const handleStartGame = () => {
    startSequence(0)
  }

  // Handle retry button
  const handleRetry = () => {
    retrySequence()
    setTimeout(() => {
      startSequence(gameState.currentSequenceIndex)
    }, 500)
  }

  // Handle reset game
  const handleResetGame = () => {
    resetGame()
    setHighlightedButton(null)
  }

  // Get current level info for additive mode
  const getCurrentLevelInfo = () => {
    if (gameState.gameMode === 'ADDITIVE' && gameState.currentSequence) {
      return `Level ${gameState.currentAdditiveLevel + 1}/${gameState.maxAdditiveLevel + 1}`
    }
    return ''
  }

  // Get current sequence description
  const getCurrentSequenceDescription = () => {
    if (gameState.gameMode === 'ADDITIVE' && gameState.currentSequence) {
      const groups = gameState.currentSequence.groups
      if (groups && groups[gameState.currentAdditiveLevel]) {
        return groups[gameState.currentAdditiveLevel].name
      }
    }
    return gameState.currentSequence?.name || ''
  }

  // Render game mode selection
  const renderGameModeSelection = () => {
    if (gameState.currentState !== 'IDLE' || gameState.currentSequence) {
      return null
    }

    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Select Game Mode</h2>
        <div className="flex flex-col items-center space-y-2">
          <select
            value={gameState.gameMode}
            onChange={handleGameModeChange}
            className="px-4 py-2 bg-slate-700 text-white rounded-md border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
          >
            <option value="NORMAL">Normal Mode</option>
            <option value="ADDITIVE">Additive Mode</option>
          </select>
          <div className="text-sm text-slate-400 text-center max-w-md">
            {gameState.gameMode === 'NORMAL' && 'Play sequences one after another'}
            {gameState.gameMode === 'ADDITIVE' && 'Build sequences incrementally by groups'}
          </div>
        </div>
      </div>
    )
  }

  // Render game status
  const renderGameStatus = () => {
    const { currentState, currentSequence, score, currentAttempt, errorMessage } = gameState
    const levelInfo = getCurrentLevelInfo()
    const sequenceDescription = getCurrentSequenceDescription()

    switch (currentState) {
      case 'IDLE':
        return (
          <div className="text-center">
            <p className="text-slate-300 mb-4">
              {currentSequence ? (
                <>
                  Ready to play: {sequenceDescription}
                  {levelInfo && <span className="text-yellow-400 ml-2">({levelInfo})</span>}
                </>
              ) : 'Ready to start!'}
            </p>
            <Button onClick={handleStartGame} className="bg-blue-600 hover:bg-blue-700">
              {currentSequence ? 'Start Sequence' : 'Start Game'}
            </Button>
          </div>
        )
      
      case 'SHOWING_SEQUENCE':
        return (
          <div className="text-center">
            <p className="text-yellow-400 font-semibold">
              Watch the sequence: {sequenceDescription}
              {levelInfo && <span className="text-slate-300 ml-2">({levelInfo})</span>}
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Memorize the pattern...
            </p>
            {gameState.gameMode === 'ADDITIVE' && (
              <p className="text-slate-500 text-xs mt-1">
                Playing buttons: [{currentSequenceButtons.join(', ')}]
              </p>
            )}
          </div>
        )
      
      case 'WAITING_FOR_INPUT':
        return (
          <div className="text-center">
            <p className="text-green-400 font-semibold">
              Your turn! Repeat the sequence
              {levelInfo && <span className="text-slate-300 ml-2">({levelInfo})</span>}
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Click the buttons in the same order
            </p>
            {gameState.gameMode === 'ADDITIVE' && (
              <p className="text-slate-500 text-xs mt-1">
                Expected: [{currentSequenceButtons.join(', ')}]
              </p>
            )}
          </div>
        )
      
      case 'CHECKING_INPUT':
        return (
          <div className="text-center">
            <p className="text-blue-400 font-semibold">
              Checking...
            </p>
          </div>
        )
      
      case 'SUCCESS':
        return (
          <div className="text-center">
            <p className="text-green-500 font-bold text-xl">
              ✅ Correct!
            </p>
            <p className="text-slate-300 mt-2">
              {gameState.gameMode === 'ADDITIVE' && gameState.currentAdditiveLevel < gameState.maxAdditiveLevel
                ? 'Great job! Moving to next level...'
                : 'Great job! Moving to next sequence...'}
            </p>
          </div>
        )
      
      case 'FAILURE':
        return (
          <div className="text-center">
            <p className="text-red-500 font-bold text-xl">
              ❌ Incorrect
            </p>
            <p className="text-slate-300 mt-2">
              {errorMessage}
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Attempt {currentAttempt} of {currentSequence?.maxAttempts}
            </p>
            <div className="mt-4 space-x-2">
              <Button onClick={handleRetry} className="bg-orange-600 hover:bg-orange-700">
                Try Again
              </Button>
              <Button onClick={handleResetGame} variant="outline">
                Reset Game
              </Button>
            </div>
          </div>
        )
      
      case 'GAME_COMPLETE':
        return (
          <div className="text-center">
            <p className="text-green-500 font-bold text-2xl">
              🎉 Game Complete!
            </p>
            <p className="text-slate-300 mt-2">
              You completed all sequences!
            </p>
            <p className="text-yellow-400 font-semibold mt-2">
              Final Score: {score}
            </p>
            <Button onClick={handleResetGame} className="mt-4 bg-green-600 hover:bg-green-700">
              Play Again
            </Button>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className={`flex flex-col items-center space-y-8 ${className}`}>
      {/* Game Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Simon Says</h1>
        <div className="flex items-center justify-center space-x-6 text-sm">
          <span className="text-slate-300">
            Sequence: {gameState.currentSequenceIndex + 1}/{gameState.sequences.length}
          </span>
          {gameState.gameMode === 'ADDITIVE' && gameState.currentSequence && (
            <span className="text-green-400">
              {getCurrentLevelInfo()}
            </span>
          )}
          <span className="text-yellow-400">
            Score: {gameState.score}
          </span>
          <span className="text-blue-400">
            Mode: {gameState.gameMode}
          </span>
        </div>
      </div>

      {/* Game Mode Selection */}
      {renderGameModeSelection()}

      {/* Game Status */}
      <div className="min-h-[100px] flex items-center justify-center">
        {renderGameStatus()}
      </div>

      {/* Game Board */}
      <GameBoard
        onButtonClick={handleButtonClick}
        gameState={gameState.currentState}
        highlightedButton={highlightedButton}
      />

    </div>
  )
} 