import type { GameMode, GameStateData } from '@/types/Game'

export interface ModeSelectorProps {
  gameState: GameStateData
  onStartGameWithMode: (mode: GameMode) => void
  className?: string
} 