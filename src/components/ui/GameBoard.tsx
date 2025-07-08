import * as React from "react"
import { GameButton } from "./GameButton"
import { cn } from "@/lib/utils"
import type { GameState } from "@/types/Game"

export interface GameBoardProps {
  className?: string
  onButtonClick?: (buttonNumber: number) => void
  activeButtons?: number[]
  disabledButtons?: number[]
  gameState?: GameState
  highlightedButton?: number | null
}

// Define button colors for each position
const buttonColors = [
  "red",     // Button 1
  "blue",    // Button 2
  "green",   // Button 3
  "yellow",  // Button 4
  "purple",  // Button 5
  "orange",  // Button 6
  "pink",    // Button 7
  "cyan",    // Button 8
] as const

/**
 * GameBoard component for Simon Says game
 * Contains 8 buttons arranged in a 2x4 grid
 * @param onButtonClick - Callback when a button is clicked
 * @param activeButtons - Array of button numbers that should be highlighted
 * @param disabledButtons - Array of button numbers that should be disabled
 * @param gameState - Current game state to determine button behavior
 * @param highlightedButton - Button number that should be highlighted during sequence playback
 */
const GameBoard = React.forwardRef<HTMLDivElement, GameBoardProps>(
  ({ 
    className, 
    onButtonClick, 
    activeButtons = [], 
    disabledButtons = [], 
    gameState,
    highlightedButton,
    ...props 
  }, ref) => {
    
    const handleButtonClick = (buttonNumber: number) => {
      // Only allow clicks during WAITING_FOR_INPUT state
      if (gameState && gameState !== 'WAITING_FOR_INPUT') {
        console.log(`GameBoard: Button ${buttonNumber} clicked but game state is ${gameState}`) // Debug log
        return
      }
      
      console.log(`GameBoard: Button ${buttonNumber} clicked`) // Debug log
      
      if (onButtonClick) {
        onButtonClick(buttonNumber)
      }
    }

    /**
     * Determine if a button should be disabled based on game state
     * @param buttonNumber - The button number to check
     * @returns Whether the button should be disabled
     */
    const isButtonDisabled = (buttonNumber: number): boolean => {
      // Check explicit disabled buttons
      if (disabledButtons.includes(buttonNumber)) {
        return true
      }

      // Disable all buttons during sequence playback
      if (gameState === 'SHOWING_SEQUENCE') {
        return true
      }

      // Disable all buttons during input checking
      if (gameState === 'CHECKING_INPUT') {
        return true
      }

      // Disable all buttons during success/failure states
      if (gameState === 'SUCCESS' || gameState === 'FAILURE') {
        return true
      }

      // Disable all buttons when game is complete
      if (gameState === 'GAME_COMPLETE') {
        return true
      }

      return false
    }

    /**
     * Determine if a button should be active/highlighted
     * @param buttonNumber - The button number to check
     * @returns Whether the button should be highlighted
     */
    const isButtonActive = (buttonNumber: number): boolean => {
      // Highlight during sequence playback
      if (highlightedButton === buttonNumber) {
        return true
      }

      // Check explicit active buttons
      if (activeButtons.includes(buttonNumber)) {
        return true
      }

      return false
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid grid-cols-2 grid-rows-4 gap-4 [grid-gap:16px] bg-slate-800",
          className
        )}
        {...props}
      >
        {/* Generate 8 buttons */}
        {Array.from({ length: 8 }, (_, index) => {
          const buttonNumber = index + 1
          const isActive = isButtonActive(buttonNumber)
          const isDisabled = isButtonDisabled(buttonNumber)
          const colorVariant = buttonColors[index]

          return (
            <GameButton
              key={buttonNumber}
              number={buttonNumber}
              variant={colorVariant}
              size="game"
              isActive={isActive}
              isDisabled={isDisabled}
              onGameClick={handleButtonClick}
            />
          )
        })}
      </div>
    )
  }
)

GameBoard.displayName = "GameBoard"

export { GameBoard } 