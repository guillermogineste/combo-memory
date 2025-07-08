import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gameButtonVariants = cva(
  "relative inline-flex items-center justify-center rounded-lg text-2xl font-bold text-white transition-all duration-200 select-none cursor-pointer border-4 border-opacity-20 shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-slate-600 hover:bg-slate-500 border-slate-400",
        red: "bg-red-600 hover:bg-red-500 border-red-400",
        blue: "bg-blue-600 hover:bg-blue-500 border-blue-400",
        green: "bg-green-600 hover:bg-green-500 border-green-400",
        yellow: "bg-yellow-600 hover:bg-yellow-500 border-yellow-400",
        purple: "bg-purple-600 hover:bg-purple-500 border-purple-400",
        orange: "bg-orange-600 hover:bg-orange-500 border-orange-400",
        pink: "bg-pink-600 hover:bg-pink-500 border-pink-400",
        cyan: "bg-cyan-600 hover:bg-cyan-500 border-cyan-400",
      },
      state: {
        normal: "",
        active: "ring-4 ring-white ring-opacity-60 scale-105 brightness-150",
        pressed: "scale-95 brightness-125",
        disabled: "opacity-50 cursor-not-allowed",
      },
      size: {
        default: "h-[120px] w-[120px]",
        sm: "h-[80px] w-[80px] text-lg",
        lg: "h-[160px] w-[160px] text-3xl",
        game: "h-[80px] w-[80px] text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "normal",
      size: "default",
    },
  }
)

export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gameButtonVariants> {
  number: number
  isActive?: boolean
  isPressed?: boolean
  isDisabled?: boolean
  onGameClick?: (number: number) => void
}

/**
 * GameButton component for Simon Says game
 * @param number - The number displayed on the button (1-8)
 * @param variant - The color variant of the button
 * @param isActive - Whether the button is currently active (highlighted)
 * @param isPressed - Whether the button is currently being pressed
 * @param isDisabled - Whether the button is disabled
 * @param onGameClick - Callback when the button is clicked, receives the button number
 */
const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    number, 
    isActive = false, 
    isPressed = false, 
    isDisabled = false, 
    onGameClick,
    onClick,
    ...props 
  }, ref) => {
    const [isCurrentlyPressed, setIsCurrentlyPressed] = React.useState(false)

    // Determine the button state based on props
    const buttonState = isDisabled 
      ? 'disabled' 
      : isActive 
        ? 'active' 
        : (isPressed || isCurrentlyPressed) 
          ? 'pressed' 
          : 'normal'

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return
      
      console.log(`Game button ${number} clicked`) // Debug log
      
      // Visual feedback
      setIsCurrentlyPressed(true)
      setTimeout(() => setIsCurrentlyPressed(false), 150)
      
      // Call the game-specific click handler
      if (onGameClick) {
        onGameClick(number)
      }
      
      // Call the standard onClick handler if provided
      if (onClick) {
        onClick(e)
      }
    }

    return (
      <button
        ref={ref}
        className={cn(gameButtonVariants({ variant, state: buttonState, size, className }))}
        onClick={handleClick}
        disabled={isDisabled}
        {...props}
      >
        <span className="drop-shadow-lg">{number}</span>
      </button>
    )
  }
)

GameButton.displayName = "GameButton"

export { GameButton, gameButtonVariants } 