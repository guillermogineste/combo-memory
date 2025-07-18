import React from 'react'
import { cn } from '@/lib/utils'
import type { ModeSelectorProps } from './ModeSelector.types'
import type { GameMode } from '@/types/Game'

/**
 * ModeSelector component that provides segmented control for game mode selection
 */
export const ModeSelector: React.FC<ModeSelectorProps> = ({ 
  gameState, 
  selectedMode,
  onModeChange,
  className 
}) => {
  // Only show mode selector when game hasn't started
  if (gameState.currentState !== 'GAME_NOT_STARTED') {
    return null
  }

  const modeOptions: { value: GameMode; label: string; description: string }[] = [
    { value: 'QUICK_MODE', label: 'Simple', description: 'Short simple sequences' },
    { value: 'CHAIN_COMBINATION_MODE', label: 'Chain', description: 'Chain long sequences' }
  ]

  /**
   * Handle mode selection change
   * @param mode - The selected game mode
   */
  const handleModeChange = (mode: GameMode) => {
    console.log('Game mode selected:', mode) // Debug log
    onModeChange(mode)
  }

  return (
    <div className={cn('flex flex-col items-center gap-2.5', className)}>
      <h2 className="font-heading text-[26px] text-black">Game mode</h2>
      
      <div className="flex border-2 border-black rounded-[24px] shadow-[0_3px_0_0_black] overflow-hidden w-[90vw] sm:w-[480px] bg-custom-control">
        {modeOptions.map((option) => (
          <label
            key={option.value}
            className={cn(
              'relative flex flex-col items-center justify-center cursor-pointer px-12 py-4 transition-all duration-150 font-bold text-sm select-none flex-1 text-center min-w-[200px]',
              'border-r-2 border-black last:border-r-0',
              selectedMode === option.value
                ? 'bg-custom-orange text-black shadow-inner'
                : 'bg-custom-control text-black hover:bg-custom-orange/90 active:bg-custom-orange/80'
            )}
          >
            <input
              type="radio"
              name="gameMode"
              value={option.value}
              checked={selectedMode === option.value}
              onChange={() => handleModeChange(option.value)}
              className="absolute opacity-0 pointer-events-none"
            />
            <span className="font-heading text-lg">
              {option.label}
            </span>
            <span className="font-interactive text-xs mt-1 opacity-80 whitespace-nowrap">
              {option.description}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
} 