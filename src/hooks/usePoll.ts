import { useEffect, useRef } from 'react'

/**
 * Generic polling hook
 * Calls the provided function at a specified interval
 * Automatically cleans up on unmount
 */
export function usePoll(
  callback: () => void | Promise<void>,
  intervalMs: number,
  options?: {
    enabled?: boolean
    runImmediately?: boolean
  }
) {
  const { enabled = true, runImmediately = false } = options ?? {}
  const savedCallback = useRef(callback)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Update ref when callback changes
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled) return

    // Run immediately if requested
    if (runImmediately) {
      savedCallback.current()
    }

    // Set up interval
    intervalRef.current = setInterval(() => {
      savedCallback.current()
    }, intervalMs)

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [intervalMs, enabled, runImmediately])
}
