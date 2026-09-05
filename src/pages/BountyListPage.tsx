import { useState } from 'react'
import { Search, Filter, X, LayoutGrid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BountyCard } from '@/components/bounty/BountyCard'
import { BountyCardSkeleton } from '@/components/bounty/BountyCardSkeleton'
import { BountyFilterSidebar } from '@/components/bounty/BountyFilterSidebar'
import { LiveIndicator } from '@/components/ui/live-indicator'
import { ErrorState } from '@/components/error/ErrorState'
import { useBountyFilters } from '@/hooks/useBountyFilters'
import { useBountyListPolling } from '@/hooks/useBountyListPolling'

type ViewMode = 'grid' | 'list'

export default function BountyListPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Poll for bounty updates every 15 seconds
  const { bounties, lastUpdated, isLoading, error, refetch } = useBountyListPolling(15000)

  const {
    filters,
    filtered,
    allTags,
    maxRewardInList,
    updateFilter,
    toggleTag,
    resetFilters,
    activeFilterCount,
  } = useBountyFilters(bounties)

  return (
    <div className="container py-8">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-3xl font-bold">Browse Bounties</h1>
          <LiveIndicator lastUpdated={lastUpdated} />
        </div>
        <p className="text-muted-foreground text-sm">
          Discover open source issues with on-chain rewards
        </p>
      </div>

      {/* Top bar: search + controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search bounties, repos, orgs..."
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            className="pl-9 h-10"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <Button
          variant={sidebarOpen ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSidebarOpen(v => !v)}
          className="gap-2 h-10"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0 ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* View mode toggle */}
        <Tabs value={viewMode} onValueChange={v => setViewMode(v as ViewMode)}>
          <TabsList className="h-10">
            <TabsTrigger value="grid" className="px-3" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="list" className="px-3" aria-label="List view">
              <List className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main content */}
      <div className="flex gap-6">
        {/* Filter sidebar */}
        {sidebarOpen && (
          <div className="hidden lg:block w-56 shrink-0">
            <BountyFilterSidebar
              filters={filters}
              allTags={allTags}
              maxRewardInList={maxRewardInList}
              activeFilterCount={activeFilterCount}
              updateFilter={updateFilter}
              toggleTag={toggleTag}
              resetFilters={resetFilters}
            />
          </div>
        )}

        {/* Bounty grid / list */}
        <div className="flex-1 min-w-0">
          {/* Result count + active tag chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">
              {filtered.length} bounti{filtered.length !== 1 ? 'es' : 'y'} found
            </span>

            {/* Active filter chips */}
            {filters.status !== 'all' && (
              <Badge
                variant="outline"
                className="gap-1 cursor-pointer hover:bg-destructive/10"
                onClick={() => updateFilter('status', 'all')}
              >
                {filters.status} <X className="h-3 w-3" />
              </Badge>
            )}
            {filters.token !== 'all' && (
              <Badge
                variant="outline"
                className="gap-1 cursor-pointer hover:bg-destructive/10"
                onClick={() => updateFilter('token', 'all')}
              >
                {filters.token} <X className="h-3 w-3" />
              </Badge>
            )}
            {filters.tags.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="gap-1 cursor-pointer hover:bg-destructive/10"
                onClick={() => toggleTag(tag)}
              >
                {tag} <X className="h-3 w-3" />
              </Badge>
            ))}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Loading state */}
          {isLoading ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BountyCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BountyCardSkeleton key={i} />
                ))}
              </div>
            )
          ) : /* Error state */ error ? (
            <ErrorState
              type="network"
              title="Failed to load bounties"
              message={error.message}
              retry={refetch}
            />
          ) : /* Empty state */ filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-1">No bounties found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Try adjusting your search or filters.
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear filters
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(bounty => (
                <BountyCard key={bounty.id} bounty={bounty} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map(bounty => (
                <BountyCard key={bounty.id} bounty={bounty} className="flex-row" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer — shown below md */}
      {sidebarOpen && (
        <div className="lg:hidden mt-4 p-4 border rounded-lg bg-card">
          <BountyFilterSidebar
            filters={filters}
            allTags={allTags}
            maxRewardInList={maxRewardInList}
            activeFilterCount={activeFilterCount}
            updateFilter={updateFilter}
            toggleTag={toggleTag}
            resetFilters={resetFilters}
          />
        </div>
      )}
    </div>
  )
}
