import type { Sequence, GameMode } from '@/types/Game'
import { SEQUENCES_PER_GAME } from '@/constants/gameConstants'

/**
 * Randomly selects a specified number of sequences from an array
 * @param sequences - Array of sequences to select from
 * @param count - Number of sequences to select
 * @returns Array of randomly selected sequences
 */
export function getRandomSequences(sequences: Sequence[], count: number): Sequence[] {
  if (sequences.length === 0) {
    console.warn('No sequences provided for random selection')
    return []
  }

  if (count >= sequences.length) {
    console.log(`Requested ${count} sequences but only ${sequences.length} available, returning all`)
    return [...sequences]
  }

  // Create a copy of the sequences array to avoid mutating the original
  const shuffledSequences = [...sequences]
  
  // Fisher-Yates shuffle algorithm
  for (let i = shuffledSequences.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledSequences[i], shuffledSequences[j]] = [shuffledSequences[j], shuffledSequences[i]]
  }

  // Return the first 'count' sequences
  const selected = shuffledSequences.slice(0, count)
  
  console.log(`Selected ${selected.length} random sequences:`, selected.map(s => s.id))
  return selected
}

/**
 * Gets the appropriate number of random sequences based on game mode
 * @param sequences - Array of sequences to select from
 * @param gameMode - Current game mode
 * @returns Array of randomly selected sequences for the game mode
 */
export function getRandomSequencesForMode(sequences: Sequence[], gameMode: GameMode): Sequence[] {
  const count = gameMode === 'QUICK_MODE' 
    ? SEQUENCES_PER_GAME.QUICK_MODE 
    : SEQUENCES_PER_GAME.CHAIN_COMBINATION_MODE
  
  console.log(`Selecting ${count} sequences for ${gameMode}`)
  return getRandomSequences(sequences, count)
} 