import type { Sequence, GameMode } from '@/types/Game'
import { SEQUENCES_PER_GAME } from '@/constants/gameConstants'

/**
 * Calculate complexity for a simple sequence (Quick Mode)
 * @param sequence - Array of button numbers
 * @returns Object with movements count and groups count (always 1 for simple sequences)
 */
function calculateSimpleSequenceComplexity(sequence: number[]): { movements: number; groups: number } {
  return {
    movements: sequence.length,
    groups: 1 // Simple sequences are always considered as 1 group
  }
}

/**
 * Calculate complexity for a chain sequence (Chain Combination Mode)
 * @param sequence - Nested array of button numbers
 * @returns Object with movements count and groups count
 */
function calculateChainSequenceComplexity(sequence: number[][]): { movements: number; groups: number } {
  const groups = sequence.length
  const movements = sequence.reduce((total, group) => total + group.length, 0)
  
  return {
    movements,
    groups
  }
}

/**
 * Calculate complexity for any sequence based on its structure
 * @param sequence - Sequence object containing either simple or chain sequence data
 * @returns Object with movements count and groups count
 */
function calculateSequenceComplexity(sequence: Sequence): { movements: number; groups: number } {
  if (Array.isArray(sequence.sequence[0])) {
    // This is a chain sequence (nested arrays)
    return calculateChainSequenceComplexity(sequence.sequence as number[][])
  } else {
    // This is a simple sequence (flat array)
    return calculateSimpleSequenceComplexity(sequence.sequence as number[])
  }
}

/**
 * Sort sequences by complexity (shortest first, longest last)
 * For simple sequences: sort by number of movements
 * For chain sequences: sort by number of groups first, then by number of movements
 * @param sequences - Array of sequences to sort
 * @returns Sorted array of sequences
 */
function sortSequencesByComplexity(sequences: Sequence[]): Sequence[] {
  return sequences.sort((a, b) => {
    const complexityA = calculateSequenceComplexity(a)
    const complexityB = calculateSequenceComplexity(b)
    
    // First compare by number of groups
    if (complexityA.groups !== complexityB.groups) {
      return complexityA.groups - complexityB.groups
    }
    
    // If groups are equal, compare by number of movements
    return complexityA.movements - complexityB.movements
  })
}

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
 * Sequences are randomly selected first, then sorted by complexity (shortest first, longest last)
 * @param sequences - Array of sequences to select from
 * @param gameMode - Current game mode
 * @returns Array of randomly selected sequences sorted by complexity
 */
export function getRandomSequencesForMode(sequences: Sequence[], gameMode: GameMode): Sequence[] {
  const count = gameMode === 'QUICK_MODE' 
    ? SEQUENCES_PER_GAME.QUICK_MODE 
    : SEQUENCES_PER_GAME.CHAIN_COMBINATION_MODE
  
  console.log(`Selecting ${count} sequences for ${gameMode}`)
  
  // First, randomly select the sequences
  const randomlySelected = getRandomSequences(sequences, count)
  
  // Then, sort them by complexity (shortest first, longest last)
  const sortedSequences = sortSequencesByComplexity(randomlySelected)
  
  console.log(`Sorted sequences by complexity:`, sortedSequences.map(s => {
    const complexity = calculateSequenceComplexity(s)
    return { id: s.id, groups: complexity.groups, movements: complexity.movements }
  }))
  
  return sortedSequences
} 