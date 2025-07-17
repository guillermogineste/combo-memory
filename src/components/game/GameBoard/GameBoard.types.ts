import type { GameState } from '@/types/Game'

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