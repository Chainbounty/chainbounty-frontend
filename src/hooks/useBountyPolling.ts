import { useState, useCallback } from 'react'
import { usePoll } from './usePoll'
import type { Bounty } from '@/types/bounty'
import { MOCK_BOUNTIES } from '@/lib/mockData'

/**
 * Hook to poll for bounty updates
 * In production, this would fetch from the backend API
 */
export function useBountyPolling(bountyId: string | undefined, intervalMs: number = 10000) {
  const [bounty, setBounty] = useState<Bounty | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchBounty = useCallback(async () => {
    if (!bountyId) return

    try {
      // Simulate API call
      await new Promise(res => setTimeout(res, 300))
      
      // In production: const response = await fetch(`/api/bounties/${bountyId}`)
      const found = MOCK_BOUNTIES.find(b => b.id === bountyId)
      
      setBounty(found ?? null)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch bounty:', error)
    } finally {
      setIsLoading(false)
    }
  }, [bountyId])

  // Poll for updates
  usePoll(fetchBounty, intervalMs, {
    enabled: !!bountyId,
    runImmediately: true,
  })

  return { bounty, isLoading, lastUpdated, refetch: fetchBounty }
}
