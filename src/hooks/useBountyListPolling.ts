import { useState, useCallback } from 'react'
import { usePoll } from './usePoll'
import type { Bounty } from '@/types/bounty'
import { MOCK_BOUNTIES } from '@/lib/mockData'

/**
 * Hook to poll for bounty list updates
 * In production, this would fetch from the backend API with filters
 */
export function useBountyListPolling(intervalMs: number = 15000) {
  const [bounties, setBounties] = useState<Bounty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchBounties = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise(res => setTimeout(res, 200))
      
      // In production: const response = await fetch('/api/bounties')
      setBounties(MOCK_BOUNTIES)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch bounties:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Poll for updates
  usePoll(fetchBounties, intervalMs, {
    enabled: true,
    runImmediately: true,
  })

  return { bounties, isLoading, lastUpdated, refetch: fetchBounties }
}
