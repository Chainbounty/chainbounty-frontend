import { X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { BountyFilters, SortOption } from '@/hooks/useBountyFilters'
import type { BountyStatus, BountyToken } from '@/types/bounty'

interface BountyFilterSidebarProps {
  filters: BountyFilters
  allTags: string[]
  maxRewardInList: number
  activeFilterCount: number
  updateFilter: <K extends keyof BountyFilters>(key: K, value: BountyFilters[K]) => void
  toggleTag: (tag: string) => void
  resetFilters: () => void
}

const STATUS_OPTIONS: { value: BountyStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'All Statuses' },
  { value: 'open',      label: 'Open' },
  { value: 'claimed',   label: 'Claimed' },
  { value: 'in_review', label: 'In Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'disputed',  label: 'Disputed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const TOKEN_OPTIONS: { value: BountyToken | 'all'; label: string }[] = [
  { value: 'all',  label: 'All Tokens' },
  { value: 'XLM',  label: 'XLM' },
  { value: 'USDC', label: 'USDC' },
  { value: 'AQUA', label: 'AQUA' },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest',      label: 'Newest First' },
  { value: 'oldest',      label: 'Oldest First' },
  { value: 'reward_high', label: 'Highest Reward' },
  { value: 'reward_low',  label: 'Lowest Reward' },
]

export function BountyFilterSidebar({
  filters,
  allTags,
  activeFilterCount,
  updateFilter,
  toggleTag,
  resetFilters,
}: BountyFilterSidebarProps) {
  return (
    <aside className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="default" className="text-xs px-1.5 py-0">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 text-xs gap-1">
            <X className="h-3 w-3" /> Clear
          </Button>
        )}
      </div>

      <Separator />

      {/* Sort */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
          Sort By
        </Label>
        <Select
          value={filters.sort}
          onValueChange={v => updateFilter('sort', v as SortOption)}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Status */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
          Status
        </Label>
        <Select
          value={filters.status}
          onValueChange={v => updateFilter('status', v as BountyStatus | 'all')}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Token */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
          Token
        </Label>
        <Select
          value={filters.token}
          onValueChange={v => updateFilter('token', v as BountyToken | 'all')}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TOKEN_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Tags
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map(tag => {
              const active = filters.tags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </aside>
  )
}
