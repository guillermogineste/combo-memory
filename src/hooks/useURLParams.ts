import { useMemo } from 'react'

/**
 * Custom hook to get URL search parameters
 * @returns Object with utility functions for URL parameters
 */
export const useURLParams = () => {
  const urlParams = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams()
    return new URLSearchParams(window.location.search)
  }, [])

  /**
   * Check if a specific parameter exists in the URL
   * @param param - The parameter name to check
   * @returns Boolean indicating if the parameter exists
   */
  const hasParam = (param: string): boolean => {
    return urlParams.has(param)
  }

  /**
   * Get the value of a specific parameter from the URL
   * @param param - The parameter name to get
   * @returns The parameter value or null if not found
   */
  const getParam = (param: string): string | null => {
    return urlParams.get(param)
  }

  /**
   * Check if debug mode is enabled via URL parameter
   * @returns Boolean indicating if debug parameter exists
   */
  const isDebugMode = (): boolean => {
    return hasParam('debug')
  }

  return {
    hasParam,
    getParam,
    isDebugMode
  }
} 