import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="bg-background border-t" role="contentinfo">
      <div className="container py-8 sm:py-10">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-3 xs:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-base sm:text-lg">
              <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
              ChainBounty
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Decentralized bounty board for open source contributors and projects.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Platform</h4>
            <nav aria-label="Platform links">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/bounties" className="hover:text-primary transition-colors">Browse Bounties</Link></li>
                <li><Link to="/post-bounty" className="hover:text-primary transition-colors">Post a Bounty</Link></li>
                <li><Link to="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Resources</h4>
            <nav aria-label="Resource links">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Docs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contributor Guide</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Maintainer Guide</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
              </ul>
            </nav>
          </div>

          {/* Community */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Community</h4>
            <nav aria-label="Community links">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a 
                    href="#" 
                    className="hover:text-primary transition-colors"
                    aria-label="ChainBounty on GitHub"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="hover:text-primary transition-colors"
                    aria-label="Join our Discord server"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="hover:text-primary transition-colors"
                    aria-label="Follow us on Twitter"
                  >
                    Twitter / X
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <Separator className="my-6 sm:my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-sm text-muted-foreground text-center sm:text-left">
          <p>© {new Date().getFullYear()} ChainBounty. Built on Stellar.</p>
          <nav aria-label="Legal links">
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  )
}
