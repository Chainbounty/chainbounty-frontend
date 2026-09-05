import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WalletButton } from '@/components/wallet/WalletButton'
import { Zap } from 'lucide-react'

const navLinks = [
  { to: '/bounties', label: 'Bounties' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/dashboard', label: 'Dashboard' },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-xl"
          aria-label="ChainBounty home"
        >
          <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
          <span>ChainBounty</span>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`
              }
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/post-bounty">Post Bounty</Link>
          </Button>
          <WalletButton />
        </div>
      </div>
    </header>
  )
}
