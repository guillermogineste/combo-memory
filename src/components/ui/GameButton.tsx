import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { UI_TIMING } from "@/constants/gameConstants"

const gameButtonVariants = cva(
  "relative inline-flex items-center justify-center rounded-lg text-2xl font-bold text-white transition-all duration-200 select-none cursor-pointer border-4 border-opacity-20 shadow-lg bg-custom-red hover:bg-custom-red border-custom-red",
  {
    variants: {
      state: {
        normal: "",
        active: "ring-4 ring-white ring-opacity-60 scale-105 brightness-150 bg-custom-red-light hover:bg-custom-red-light border-custom-red-light",
        pressed: "scale-95 brightness-125",
        disabled: "opacity-50 cursor-not-allowed",
        success: "bg-green-500 hover:bg-green-500 border-green-500 ring-4 ring-green-300 ring-opacity-60 scale-105 brightness-150",
        fail: "bg-red-600 hover:bg-red-600 border-red-600 ring-4 ring-red-300 ring-opacity-60 scale-105 brightness-150",
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
  isSuccess?: boolean
  isFail?: boolean
  onGameClick?: (number: number) => void
}

/**
 * GameButton component for Simon Says game
 * @param number - The number displayed on the button (1-8)
 * @param isActive - Whether the button is currently active (highlighted)
 * @param isPressed - Whether the button is currently being pressed
 * @param isDisabled - Whether the button is disabled
 * @param isSuccess - Whether the button should show success state (green)
 * @param isFail - Whether the button should show fail state (red)
 * @param onGameClick - Callback when the button is clicked, receives the button number
 */
const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ 
    className, 
    size, 
    number, 
    isActive = false, 
    isPressed = false, 
    isDisabled = false, 
    isSuccess = false,
    isFail = false,
    onGameClick,
    onClick,
    ...props 
  }, ref) => {
    const [isCurrentlyPressed, setIsCurrentlyPressed] = React.useState(false)

    // Determine the button state based on props
    // Priority: success/fail > active > disabled > pressed > normal
    const getButtonState = () => {
      if (isSuccess) return 'success'
      if (isFail) return 'fail'
      if (isActive) return 'active'
      if (isDisabled) return 'disabled'
      if (isPressed || isCurrentlyPressed) return 'pressed'
      return 'normal'
    }

    const buttonState = getButtonState()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Don't allow clicks when in success/fail state or disabled
      if (isDisabled || isSuccess || isFail) return
      
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
        disabled={isDisabled && !isActive}
        {...props}
      >
        <span className="drop-shadow-lg">{number}</span>
      </button>
    )
  }
)

GameButton.displayName = "GameButton"

export { GameButton } 