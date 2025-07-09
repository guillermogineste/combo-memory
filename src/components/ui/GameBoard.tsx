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
 * Contains 8 buttons arranged in a 4x6 grid with varying spans
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

    /**
     * Creates a GameButton with all necessary props
     * @param buttonNumber - The button number (1-8)
     * @returns GameButton component
     */
    const createGameButton = (buttonNumber: number) => {
      const isActive = isButtonActive(buttonNumber)
      const isDisabled = isButtonDisabled(buttonNumber)
      const colorVariant = buttonColors[buttonNumber - 1]

             return (
         <GameButton
           key={buttonNumber}
           number={buttonNumber}
           variant={colorVariant}
           size="flexible"
           isActive={isActive}
           isDisabled={isDisabled}
           onGameClick={handleButtonClick}
         />
       )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid grid-cols-4 grid-rows-6 gap-4 [grid-gap:16px] w-[480px] h-[360px] mx-auto",
          className
        )}
        {...props}
      >
        {/* Button 1 - Column 2, Rows 1-2 (spans 2 rows) */}
        <div className="col-start-2 row-start-1 row-span-2">
          <div className="p-2.5 w-full h-full">
            {createGameButton(1)}
          </div>
        </div>

        {/* Button 2 - Column 3, Rows 1-2 (spans 2 rows) */}
        <div className="col-start-3 row-start-1 row-span-2">
          <div className="p-2.5 w-full h-full">
            {createGameButton(2)}
          </div>
        </div>

        {/* Button 3 - Column 1, Rows 2-3 (spans 2 rows) */}
        <div className="col-start-1 row-start-2 row-span-2">
          <div className="p-2.5 w-full h-full">
            {createGameButton(3)}
          </div>
        </div>

        {/* Button 4 - Column 4, Rows 2-3 (spans 2 rows) */}
        <div className="col-start-4 row-start-2 row-span-2">
          <div className="p-2.5 w-full h-full">
            {createGameButton(4)}
          </div>
        </div>

        {/* Button 5 - Column 2, Rows 3-5 (spans 3 rows) */}
        <div className="col-start-2 row-start-3 row-span-3">
          <div className="p-2.5 w-full h-full">
            {createGameButton(5)}
          </div>
        </div>

        {/* Button 6 - Column 3, Rows 3-5 (spans 3 rows) */}
        <div className="col-start-3 row-start-3 row-span-3">
          <div className="p-2.5 w-full h-full">
            {createGameButton(6)}
          </div>
        </div>

        {/* Button 7 - Column 1, Rows 5-6 (spans 2 rows) */}
        <div className="col-start-1 row-start-5 row-span-2">
          <div className="p-2.5 w-full h-full">
            {createGameButton(7)}
          </div>
        </div>

        {/* Button 8 - Column 4, Rows 5-6 (spans 2 rows) */}
        <div className="col-start-4 row-start-5 row-span-2">
          <div className="p-2.5 w-full h-full">
            {createGameButton(8)}
          </div>
        </div>
      </div>
    )
  }
)

GameBoard.displayName = "GameBoard"

export { GameBoard } 