import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { UI_TIMING } from "@/constants/gameConstants"

const gameButtonVariants = cva(
  "relative inline-flex items-center justify-center rounded-lg text-2xl font-bold text-white transition-all duration-150 select-none cursor-pointer border-4 border-opacity-20 shadow-lg bg-custom-red hover:bg-custom-red border-custom-red",
  {
    variants: {
      state: {
        resting: "",
        active: "ring-4 ring-white ring-opacity-60 scale-105 brightness-150 bg-custom-red-light hover:bg-custom-red-light border-custom-red-light",
        success: "bg-green-500 hover:bg-green-500 border-green-500 ring-4 ring-green-300 ring-opacity-60 scale-105 brightness-150",
        failure: "bg-red-600 hover:bg-red-600 border-red-600 ring-4 ring-red-300 ring-opacity-60 scale-105 brightness-150",
      },
      size: {
        default: "h-[120px] w-[120px]",
        sm: "h-[80px] w-[80px] text-lg",
        lg: "h-[160px] w-[160px] text-3xl",
        game: "h-[80px] w-[80px] text-xl",
        flexible: "h-full w-full text-xl",
      },
    },
    defaultVariants: {
      state: "resting",
      size: "default",
    },
  }
)

export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gameButtonVariants> {
  number: number
  isActive?: boolean
  isDisabled?: boolean
  isSuccess?: boolean
  isFailure?: boolean
  onGameClick?: (number: number) => void
}

/**
 * GameButton component for Simon Says game
 * @param number - The number displayed on the button (1-8)
 * @param isActive - Whether the button is currently active (highlighted during sequence or user press)
 * @param isDisabled - Whether the button is disabled (but visually looks like resting state)
 * @param isSuccess - Whether the button should show success state (green)
 * @param isFailure - Whether the button should show failure state (red)
 * @param onGameClick - Callback when the button is clicked, receives the button number
 */
const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ 
    className, 
    size, 
    number, 
    isActive = false, 
    isDisabled = false, 
    isSuccess = false,
    isFailure = false,
    onGameClick,
    onClick,
    ...props 
  }, ref) => {
    const [isCurrentlyPressed, setIsCurrentlyPressed] = React.useState(false)

    // Determine the button state based on props
    // Priority: success/failure > active > resting
    const getButtonState = () => {
      if (isSuccess) return 'success'
      if (isFailure) return 'failure'
      if (isActive || isCurrentlyPressed) return 'active'
      return 'resting'
    }

    const buttonState = getButtonState()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Don't allow clicks when in success/failure state or disabled
      if (isDisabled || isSuccess || isFailure) return
      
      console.log(`Game button ${number} clicked`) // Debug log
      
      // Visual feedback
      setIsCurrentlyPressed(true)
      setTimeout(() => setIsCurrentlyPressed(false), UI_TIMING.buttonPressedDuration)
      
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
        className={cn(gameButtonVariants({ state: buttonState, size, className }))}
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

export { GameButton } 