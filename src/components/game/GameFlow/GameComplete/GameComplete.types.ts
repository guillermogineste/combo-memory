import type { GameStateData } from '@/types/Game'

export interface GameCompleteProps {
  gameState: GameStateData
  onResetGame: () => void
  className?: string
} 