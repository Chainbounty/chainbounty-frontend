import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { BountyCard } from '@/components/bounty/BountyCard'
import { BountyCardSkeleton } from '@/components/bounty/BountyCardSkeleton'
import { MOCK_BOUNTIES } from '@/lib/mockData'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial data load
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container py-8 sm:py-12 md:py-20">
      <div className="text-center mb-8 sm:mb-12 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
          Welcome to ChainBounty
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
          Decentralized bounty board for open source contributors on Stellar.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-3">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link to="/bounties">Browse Bounties</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
            <Link to="/post-bounty">Post a Bounty</Link>
          </Button>
        </div>
      </div>

      {/* Featured bounties preview */}
      <div className="px-4 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Latest Bounties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {isLoading ? (
            <>
              <BountyCardSkeleton />
              <BountyCardSkeleton />
              <BountyCardSkeleton className="hidden md:block" />
            </>
          ) : (
            MOCK_BOUNTIES.slice(0, 3).map(bounty => (
              <BountyCard key={bounty.id} bounty={bounty} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
