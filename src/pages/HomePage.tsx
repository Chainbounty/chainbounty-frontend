import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { BountyCard } from '@/components/bounty/BountyCard'
import { MOCK_BOUNTIES } from '@/lib/mockData'

export default function HomePage() {
  return (
    <div className="container py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to ChainBounty</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Decentralized bounty board for open source contributors.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link to="/bounties">Browse Bounties</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/post-bounty">Post a Bounty</Link>
          </Button>
        </div>
      </div>

      {/* Featured bounties preview */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Latest Bounties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_BOUNTIES.slice(0, 3).map(bounty => (
            <BountyCard key={bounty.id} bounty={bounty} />
          ))}
        </div>
      </div>
    </div>
  )
}
