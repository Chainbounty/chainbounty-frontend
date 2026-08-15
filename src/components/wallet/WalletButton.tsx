import { Loader2, Wallet, LogOut, ChevronDown, AlertCircle } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from 'react-router-dom'

export function WalletButton() {
  const { isConnected, isLoading, address, shortAddress, network, error, connect, disconnect } =
    useWallet()

  // Loading state
  if (isLoading) {
    return (
      <Button size="sm" disabled>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Connecting...
      </Button>
    )
  }

  // Connected state — show address dropdown
  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" className="gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs">{shortAddress}</span>
            {network && (
              <Badge
                variant={network === 'PUBLIC' ? 'default' : 'secondary'}
                className="text-xs px-1 py-0"
              >
                {network === 'PUBLIC' ? 'Mainnet' : network}
              </Badge>
            )}
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-xs font-medium">Connected Wallet</p>
              <p className="font-mono text-xs text-muted-foreground break-all">{address}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={`/profile/${address}`}>My Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={disconnect}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Error state
  if (error) {
    return (
      <Button size="sm" variant="destructive" onClick={connect} className="gap-2">
        <AlertCircle className="h-4 w-4" />
        Retry Connect
      </Button>
    )
  }

  // Default — not connected
  return (
    <Button size="sm" onClick={connect} className="gap-2">
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
