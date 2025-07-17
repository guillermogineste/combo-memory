import * as React from "react"

export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  number: number
  isActive?: boolean
  isDisabled?: boolean
  isSuccess?: boolean
  isFailure?: boolean
  onGameClick?: (number: number) => void
  size?: "default" | "sm" | "lg" | "game" | "flexible"
} 