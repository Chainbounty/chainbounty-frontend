import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Zap className="h-4 w-4 text-primary" />
              ChainBounty
            </div>
            <p className="text-sm text-muted-foreground">
              Decentralized bounty board for open source contributors and projects.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/bounties" className="hover:text-primary transition-colors">Browse Bounties</Link></li>
              <li><Link to="/post-bounty" className="hover:text-primary transition-colors">Post a Bounty</Link></li>
              <li><Link to="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contributor Guide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Maintainer Guide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Twitter / X</a></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ChainBounty. Built on Stellar.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
