import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * UIButton component variants using class-variance-authority
 * Unified styling for all UI buttons with consistent game design
 */
const uiButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-bold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer bg-custom-orange hover:bg-custom-orange/90 text-black border-[3px] border-black shadow-[0_4px_0_0_black] active:shadow-[0_2px_0_0_black] active:translate-y-[2px]",
  {
    variants: {
      size: {
        default: "h-10 px-4 py-2 text-sm rounded-[24px]",
        large: "min-w-[200px] h-[80px] text-lg flex-col space-y-1 rounded-[32px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface UIButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof uiButtonVariants> {
  asChild?: boolean
}

/**
 * UIButton component - unified button for all UI actions
 * Features consistent styling with 3px black border, FF8060 background, and 4px solid drop shadow
 * 
 * @param size - Button size variant (default or large)
 * @param asChild - Whether to render as child component (for advanced usage)
 * @param className - Additional CSS classes
 * @param children - Button content
 */
const UIButton = React.forwardRef<HTMLButtonElement, UIButtonProps>(
  ({ className, size, asChild = false, children, ...props }, ref) => {
    if (asChild) {
      return <>{children}</>
    }
    
    return (
      <button
        ref={ref}
        className={cn(uiButtonVariants({ size, className }))}
        {...props}
      >
        {children}
      </button>
    )
  }
)

UIButton.displayName = "UIButton"

export { UIButton } 