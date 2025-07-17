import type { GameStateData } from '@/types/Game'

export interface GamePlayProps {
  gameState: GameStateData
  onButtonClick: (buttonNumber: number) => void
  onRetry: () => void
  onResetGame: () => void
  highlightedButton: number | null
  className?: string
} 