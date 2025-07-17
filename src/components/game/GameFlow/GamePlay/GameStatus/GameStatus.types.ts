import type { GameStateData } from '@/types/Game'

export interface GameStatusProps {
  gameState: GameStateData
  onRetry: () => void
  onResetGame: () => void
  className?: string
} 