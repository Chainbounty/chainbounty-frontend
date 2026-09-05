import { Link } from 'react-router-dom'
import {
  Coins, Target, TrendingUp, Clock, Flag, Send, CheckCircle2,
  AlertTriangle, Eye, Wallet, BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BountyCard } from '@/components/bounty/BountyCard'
import { LiveIndicator } from '@/components/ui/live-indicator'
import { useWallet } from '@/contexts/WalletContext'
import { useBountyListPolling } from '@/hooks/useBountyListPolling'
import { MOCK_CONTRIBUTOR_STATS, MOCK_CONTRIBUTOR_ACTIVITY } from '@/lib/mockData'
import { timeAgo } from '@/lib/bounty'
import { cn } from '@/lib/utils'

const ACTIVITY_CONFIG = {
  claimed: { icon: Flag, label: 'Claimed', color: 'text-blue-500' },
  submitted: { icon: Send, label: 'Submitted', color: 'text-purple-500' },
  approved: { icon: CheckCircle2, label: 'Approved', color: 'text-green-500' },
  disputed: { icon: AlertTriangle, label: 'Disputed', color: 'text-orange-500' },
}

export default function DashboardPage() {
  const { isConnected, address, shortAddress, connect } = useWallet()
  const { bounties, lastUpdated } = useBountyListPolling(15000)

  // Not connected state
  if (!isConnected) {
    return (
      <div className="container py-20 max-w-md text-center">
        <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-muted-foreground mb-6">
          Connect your Freighter wallet to view your dashboard, earnings, and active bounties.
        </p>
        <Button onClick={connect} size="lg" className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </div>
    )
  }

  const stats = MOCK_CONTRIBUTOR_STATS[address ?? '']
  const activity = MOCK_CONTRIBUTOR_ACTIVITY[address ?? ''] ?? []

  // Filter bounties
  const myPostedBounties = bounties.filter(b => b.postedBy === address)
  const myClaimedBounties = bounties.filter(
    b => b.claimedBy === address && (b.status === 'claimed' || b.status === 'in_review')
  )
  const myCompletedBounties = bounties.filter(
    b => b.claimedBy === address && b.status === 'completed'
  )

  const totalEarned = myCompletedBounties.reduce((sum, b) => sum + b.reward, 0)
  const totalPosted = myPostedBounties.reduce((sum, b) => sum + b.reward, 0)
  const pendingReview = myPostedBounties.filter(b => b.status === 'in_review').length

  return (
    <div className="container py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <LiveIndicator lastUpdated={lastUpdated} />
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[10px]">
              {address?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-muted-foreground font-mono">{shortAddress}</p>
          <Link to={`/profile/${address}`} className="text-sm text-primary hover:underline">
            View Profile
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-5 pb-5 text-center">
            <div className="flex justify-center mb-2">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Coins className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-500">{totalEarned.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Earned (USDC)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5 text-center">
            <div className="flex justify-center mb-2">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">{myClaimedBounties.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Active Bounties</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5 text-center">
            <div className="flex justify-center mb-2">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">{totalPosted.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Posted (USDC)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5 text-center">
            <div className="flex justify-center mb-2">
              <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">{pendingReview}</p>
            <p className="text-xs text-muted-foreground mt-1">Pending Review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left / Main ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Active bounties (claimed) */}
          {myClaimedBounties.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  My Active Bounties
                  <Badge variant="default">{myClaimedBounties.length}</Badge>
                </CardTitle>
                <CardDescription>Bounties you've claimed and are currently working on</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {myClaimedBounties.map(bounty => (
                  <BountyCard key={bounty.id} bounty={bounty} />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Posted bounties needing action */}
          {myPostedBounties.filter(b => b.status === 'in_review').length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-4 w-4 text-orange-500" />
                  Needs Your Review
                  <Badge variant="warning">{pendingReview}</Badge>
                </CardTitle>
                <CardDescription>Work has been submitted on these bounties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {myPostedBounties
                  .filter(b => b.status === 'in_review')
                  .map(bounty => (
                    <BountyCard key={bounty.id} bounty={bounty} />
                  ))}
              </CardContent>
            </Card>
          )}

          {/* Empty state */}
          {myClaimedBounties.length === 0 && pendingReview === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No active bounties</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Claim a bounty to get started earning rewards for your contributions.
                </p>
                <Button asChild>
                  <Link to="/bounties">Browse Open Bounties</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Right / Sidebar ── */}
        <div className="space-y-4">
          {/* Quick actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start gap-2" variant="outline" asChild>
                <Link to="/bounties">
                  <Target className="h-4 w-4" />
                  Browse Bounties
                </Link>
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline" asChild>
                <Link to="/post-bounty">
                  <Coins className="h-4 w-4" />
                  Post a Bounty
                </Link>
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline" asChild>
                <Link to={`/profile/${address}`}>
                  <TrendingUp className="h-4 w-4" />
                  My Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Contributor stats */}
          {stats && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-semibold">{stats.bountiesCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-semibold">{stats.successRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Avg. Time</span>
                  <span className="font-semibold">{stats.averageCompletionTime.toFixed(1)}d</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reputation</span>
                  <Badge variant="outline">{stats.reputationScore}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Global Rank</span>
                  <Badge variant="default">#{stats.rank}</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent activity */}
          {activity.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {activity.slice(0, 5).map(item => {
                    const config = ACTIVITY_CONFIG[item.action]
                    const Icon = config.icon
                    return (
                      <li key={item.id} className="flex gap-2.5">
                        <div className={cn('h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0')}>
                          <Icon className={cn('h-3.5 w-3.5', config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-xs font-medium">{config.label}</span>
                            <span className="text-xs text-muted-foreground">{timeAgo(item.timestamp)}</span>
                          </div>
                          <Link
                            to={`/bounties/${item.bountyId}`}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {item.bountyTitle}
                          </Link>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
