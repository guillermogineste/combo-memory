import React, { useEffect, useState, useCallback } from 'react'
import { GameBoard } from './ui/GameBoard'
import { Button } from './ui/button'
import { useGameState } from '@/hooks/useGameState'
import { useSequencePlayback } from '@/hooks/useSequencePlayback'

export interface GameControllerProps {
  className?: string
}

/**
 * GameController component that manages the entire Simon Says game flow
 * Coordinates game state management and sequence playback
 */
export const GameController: React.FC<GameControllerProps> = ({ className }) => {
  const {
    gameState,
    dispatch,
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
    console.log('Sequence playback completed')
    dispatch({ type: 'SEQUENCE_COMPLETE' })
  }, [dispatch])

  // Handle button highlighting during sequence playback
  const handleButtonHighlight = useCallback((buttonNumber: number | null) => {
    setHighlightedButton(buttonNumber)
  }, [])

  // Initialize sequence playback hook
  useSequencePlayback({
    sequence: gameState.currentSequence,
    isPlaying: gameState.currentState === 'SHOWING_SEQUENCE',
    onSequenceComplete: handleSequenceComplete,
    onButtonHighlight: handleButtonHighlight
  })

  // Handle user button clicks
  const handleButtonClick = useCallback((buttonNumber: number) => {
    if (gameState.currentState !== 'WAITING_FOR_INPUT') {
      console.log('Button click ignored - not waiting for input')
      return
    }

    console.log('User clicked button:', buttonNumber)
    addUserInput(buttonNumber)
  }, [gameState.currentState, addUserInput])

  // Check user input whenever it changes
  useEffect(() => {
    if (gameState.currentState === 'WAITING_FOR_INPUT' && 
        gameState.userInput.length > 0) {
      console.log('Checking user input:', gameState.userInput)
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

  // Handle start game button
  const handleStartGame = () => {
    console.log('Starting game')
    startSequence(0)
  }

  // Handle retry button
  const handleRetry = () => {
    console.log('Retrying sequence')
    retrySequence()
    setTimeout(() => {
      startSequence(gameState.currentSequenceIndex)
    }, 500)
  }



  // Handle reset game
  const handleResetGame = () => {
    console.log('Resetting game')
    resetGame()
    setHighlightedButton(null)
  }

  // Render game status
  const renderGameStatus = () => {
    const { currentState, currentSequence, score, currentAttempt, errorMessage } = gameState

    switch (currentState) {
      case 'IDLE':
        return (
          <div className="text-center">
            <p className="text-slate-300 mb-4">
              {currentSequence ? `Ready to play: ${currentSequence.name}` : 'Ready to start!'}
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
              Watch the sequence: {currentSequence?.name}
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Memorize the pattern...
            </p>
          </div>
        )
      
      case 'WAITING_FOR_INPUT':
        return (
          <div className="text-center">
            <p className="text-green-400 font-semibold">
              Your turn! Repeat the sequence
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Click the buttons in the same order
            </p>
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
              Great job! Moving to next sequence...
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
          <span className="text-yellow-400">
            Score: {gameState.score}
          </span>
        </div>
      </div>

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

      {/* Debug Info */}
      <div className="text-center text-xs text-slate-500">
        <p>State: {gameState.currentState}</p>
        <p>User Input: [{gameState.userInput.join(', ')}]</p>
        {gameState.currentSequence && (
          <p>Expected: [{gameState.currentSequence.buttons.join(', ')}]</p>
        )}
      </div>
    </div>
  )
} 