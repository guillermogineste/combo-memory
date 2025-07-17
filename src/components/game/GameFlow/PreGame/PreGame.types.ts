import type { GameStateData, GameMode, DifficultyLevel } from '@/types/Game'

export interface PreGameProps {
  gameState: GameStateData
  onStartGameWithMode: (mode: GameMode, difficulty: DifficultyLevel) => void
  className?: string
} 