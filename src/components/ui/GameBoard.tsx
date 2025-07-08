import * as React from "react"
import { GameButton } from "./GameButton"
import { cn } from "@/lib/utils"

export interface GameBoardProps {
  className?: string
  onButtonClick?: (buttonNumber: number) => void
  activeButtons?: number[]
  disabledButtons?: number[]
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
 */
const GameBoard = React.forwardRef<HTMLDivElement, GameBoardProps>(
  ({ className, onButtonClick, activeButtons = [], disabledButtons = [], ...props }, ref) => {
    
    const handleButtonClick = (buttonNumber: number) => {
      console.log(`GameBoard: Button ${buttonNumber} clicked`) // Debug log
      
      if (onButtonClick) {
        onButtonClick(buttonNumber)
      }
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
          const isActive = activeButtons.includes(buttonNumber)
          const isDisabled = disabledButtons.includes(buttonNumber)
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