import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { WalletButton } from '@/components/wallet/WalletButton'

const navLinks = [
  { to: '/bounties', label: 'Bounties' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/disputes', label: 'Disputes' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-lg sm:text-xl"
          aria-label="ChainBounty home"
        >
          <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
          <span className="hidden xs:inline">ChainBounty</span>
          <span className="xs:hidden">CB</span>
          <Badge variant="secondary" className="text-xs hidden sm:inline-flex">Beta</Badge>
        </Link>

        {/* Desktop nav links */}
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

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/post-bounty">Post Bounty</Link>
          </Button>
          <WalletButton />
        </div>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2">
          <WalletButton />
          
          {/* Mobile menu trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-4 mt-6" aria-label="Mobile navigation">
                {navLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-base font-medium transition-colors hover:text-primary py-2 ${
                        isActive ? 'text-primary' : 'text-foreground'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                
                <div className="pt-4 border-t">
                  <Button variant="default" size="lg" asChild className="w-full">
                    <Link to="/post-bounty" onClick={() => setMobileMenuOpen(false)}>
                      Post Bounty
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
