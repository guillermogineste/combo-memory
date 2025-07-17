import type { GameStateData } from '@/types/Game'

export interface GameControllerProps {
  className?: string
  onDebugUpdate?: (data: { gameState: GameStateData; currentSequenceButtons: number[] }) => void
} 