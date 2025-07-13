import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { UI_TIMING } from "@/constants/gameConstants"

const gameButtonVariants = cva(
  "shadow-[0_4px_0_0_black] relative inline-flex items-center justify-center rounded-3xl text-2xl font-bold text-white transition-all duration-150 select-none cursor-pointer border-3 bg-custom-red hover:bg-custom-red border-black",
  {
    variants: {
      state: {
        resting: "",
        active: "scale-105 bg-custom-red-light hover:bg-custom-red-light",
        success: "bg-custom-green hover:bg-custom-green border-custom-green-dark ring-custom-green scale-105 shadow-[0_4px_0_0_rgb(66,94,0)]",
        failure: "bg-custom-red-bright hover:bg-custom-red-bright border-custom-red-darker ring-custom-red-bright scale-105 shadow-[0_4px_0_0_rgb(126,22,22)]",
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