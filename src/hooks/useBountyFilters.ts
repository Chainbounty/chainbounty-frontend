import { useState, useMemo, useCallback } from 'react'
import type { Bounty, BountyStatus, BountyToken } from '@/types/bounty'

export type SortOption = 'newest' | 'oldest' | 'reward_high' | 'reward_low'

export interface BountyFilters {
  search: string
  status: BountyStatus | 'all'
  token: BountyToken | 'all'
  tags: string[]
  minReward: number
  maxReward: number
  sort: SortOption
}

const DEFAULT_FILTERS: BountyFilters = {
  search: '',
  status: 'all',
  token: 'all',
  tags: [],
  minReward: 0,
  maxReward: 10000,
  sort: 'newest',
}

export function useBountyFilters(bounties: Bounty[]) {
  const [filters, setFilters] = useState<BountyFilters>(DEFAULT_FILTERS)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    bounties.forEach(b => b.tags.forEach(t => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [bounties])

  const maxRewardInList = useMemo(
    () => Math.max(...bounties.map(b => b.reward), 0),
    [bounties]
  )

  const filtered = useMemo(() => {
    let result = [...bounties]

    // Search: title, description, repoName
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.repoName.toLowerCase().includes(q) ||
          b.organization.toLowerCase().includes(q)
      )
    }

    // Status
    if (filters.status !== 'all') {
      result = result.filter(b => b.status === filters.status)
    }

    // Token
    if (filters.token !== 'all') {
      result = result.filter(b => b.token === filters.token)
    }

    // Tags (AND logic — bounty must have ALL selected tags)
    if (filters.tags.length > 0) {
      result = result.filter(b => filters.tags.every(t => b.tags.includes(t)))
    }

    // Reward range
    result = result.filter(
      b => b.reward >= filters.minReward && b.reward <= filters.maxReward
    )

    // Sort
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'reward_high':
          return b.reward - a.reward
        case 'reward_low':
          return a.reward - b.reward
        default:
          return 0
      }
    })

    return result
  }, [bounties, filters])

  const updateFilter = useCallback(<K extends keyof BountyFilters>(key: K, value: BountyFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleTag = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const activeFilterCount = [
    filters.search !== '',
    filters.status !== 'all',
    filters.token !== 'all',
    filters.tags.length > 0,
    filters.minReward > 0 || filters.maxReward < maxRewardInList,
  ].filter(Boolean).length

  return {
    filters,
    filtered,
    allTags,
    maxRewardInList,
    updateFilter,
    toggleTag,
    resetFilters,
    activeFilterCount,
  }
}
