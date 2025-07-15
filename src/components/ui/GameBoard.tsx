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
  lastPressedButton?: number | null
  lastButtonResult?: 'success' | 'fail' | null
}

/**
 * Button configuration for the 4x6 grid layout
 * Each button has its number and grid position
 */
const BUTTON_CONFIG = [
  { number: 1, colStart: 2, rowStart: 1, rowSpan: 2 },
  { number: 2, colStart: 3, rowStart: 1, rowSpan: 2 },
  { number: 3, colStart: 1, rowStart: 2, rowSpan: 2 },
  { number: 4, colStart: 4, rowStart: 2, rowSpan: 2 },
  { number: 5, colStart: 2, rowStart: 3, rowSpan: 3 },
  { number: 6, colStart: 3, rowStart: 3, rowSpan: 3 },
  { number: 7, colStart: 1, rowStart: 5, rowSpan: 2 },
  { number: 8, colStart: 4, rowStart: 5, rowSpan: 2 },
] as const

/**
 * GameBoard component for Simon Says game
 * Contains 8 buttons arranged in a 4x6 grid with varying spans
 */
const GameBoard = React.forwardRef<HTMLDivElement, GameBoardProps>(
  ({ 
    className, 
    onButtonClick, 
    activeButtons = [], 
    disabledButtons = [], 
    gameState,
    highlightedButton,
    lastPressedButton,
    lastButtonResult,
    ...props 
  }, ref) => {
    
    /**
     * Handle button click with game state validation
     * @param buttonNumber - The number of the button that was clicked
     */
    const handleButtonClick = (buttonNumber: number) => {
      console.log(`GameBoard: Button ${buttonNumber} clicked`) // Debug log
      
      if (onButtonClick) {
        onButtonClick(buttonNumber)
      }
    }

    /**
     * Determine button state based on game state and props
     */
    const getButtonState = (buttonNumber: number) => {
      // Check if button should be disabled
      const isExplicitlyDisabled = disabledButtons.includes(buttonNumber)
      const isGameDisabled = gameState !== 'WAITING_FOR_INPUT' && gameState !== undefined
      const isDisabled = isExplicitlyDisabled || isGameDisabled
      
      // Check if button should be active/highlighted
      const isHighlighted = highlightedButton === buttonNumber
      const isExplicitlyActive = activeButtons.includes(buttonNumber)
      const isActive = isHighlighted || isExplicitlyActive

      // Check if button should show success/failure state
      const isSuccess = lastPressedButton === buttonNumber && lastButtonResult === 'success'
      const isFailure = lastPressedButton === buttonNumber && lastButtonResult === 'fail'

      return { isActive, isDisabled, isSuccess, isFailure }
    }

    /**
     * Render a single button with its grid positioning
     */
    const renderButton = (config: { number: number; colStart: number; rowStart: number; rowSpan: number }) => {
      const { number, colStart, rowStart, rowSpan } = config
      const { isActive, isDisabled, isSuccess, isFailure } = getButtonState(number)

      return (
        <div
          key={number}
          className={cn(
            "p-2.5",
            `col-start-${colStart}`,
            `row-start-${rowStart}`,
            `row-span-${rowSpan}`
          )}
          style={{
            gridColumnStart: colStart,
            gridRowStart: rowStart,
            gridRowEnd: `span ${rowSpan}`,
          }}
        >
          <GameButton
            number={number}
            size="flexible"
            isActive={isActive}
            isDisabled={isDisabled}
            isSuccess={isSuccess}
            isFailure={isFailure}
            onGameClick={handleButtonClick}
          />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid grid-cols-4 grid-rows-6 w-[75vw] h-[60vh] max-w-[680px] max-h-[490px] mx-auto",
          className
        )}
        {...props}
      >
        {BUTTON_CONFIG.map(renderButton)}
      </div>
    )
  }
)

GameBoard.displayName = "GameBoard"

export { GameBoard } 