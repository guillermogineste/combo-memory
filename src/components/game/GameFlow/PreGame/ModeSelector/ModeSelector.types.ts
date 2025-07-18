import type { GameMode, GameStateData } from '@/types/Game'

export interface ModeSelectorProps {
  gameState: GameStateData
  selectedMode: GameMode
  onModeChange: (mode: GameMode) => void
  className?: string
} 