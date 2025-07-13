import { cva } from "class-variance-authority"

/**
 * Button variants using class-variance-authority
 * Defines the styling options for button components
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-slate-300 bg-white hover:bg-slate-50",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200",
        ghost: "hover:bg-slate-100",
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
) 