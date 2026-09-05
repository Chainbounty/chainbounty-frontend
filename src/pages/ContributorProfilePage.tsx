import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, ExternalLink, Copy, Check, Coins, Target, TrendingUp,
  Clock, Award, Calendar, Flag, Send, CheckCircle2, AlertTriangle
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { BountyCard } from '@/components/bounty/BountyCard'
import { shortAddress, timeAgo } from '@/lib/bounty'
import {
  MOCK_BOUNTIES,
  MOCK_CONTRIBUTOR_STATS,
  MOCK_CONTRIBUTOR_ACTIVITY,
} from '@/lib/mockData'
import { cn } from '@/lib/utils'

const ACTIVITY_CONFIG = {
  claimed: { icon: Flag, label: 'Claimed', color: 'text-blue-500' },
  submitted: { icon: Send, label: 'Submitted', color: 'text-purple-500' },
  approved: { icon: CheckCircle2, label: 'Approved', color: 'text-green-500' },
  disputed: { icon: AlertTriangle, label: 'Disputed', color: 'text-orange-500' },
}

export default function ContributorProfilePage() {
  const { address } = useParams<{ address: string }>()
  const [copied, setCopied] = useState(false)

  if (!address) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Invalid address</h2>
        <Button asChild className="mt-4">
          <Link to="/leaderboard">View Leaderboard</Link>
        </Button>
      </div>
    )
  }

  const stats = MOCK_CONTRIBUTOR_STATS[address]
  const activity = MOCK_CONTRIBUTOR_ACTIVITY[address] ?? []
  const activeBounties = MOCK_BOUNTIES.filter(
    b => b.claimedBy === address && (b.status === 'claimed' || b.status === 'in_review')
  )
  const completedBounties = MOCK_BOUNTIES.filter(
    b => b.claimedBy === address && b.status === 'completed'
  )

  function copyAddress() {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TooltipProvider>
      <div className="container py-8 max-w-6xl">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link to="/leaderboard">
            <ArrowLeft className="h-4 w-4" />
            Back to leaderboard
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left / Main ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Profile header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20 shrink-0">
                    <AvatarFallback className="text-xl font-bold">
                      {address.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold">Contributor</h1>
                      {stats && stats.rank <= 10 && (
                        <Badge variant="default" className="gap-1">
                          <Award className="h-3 w-3" />
                          Top {stats.rank}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <p className="font-mono text-sm text-muted-foreground break-all">
                        {address}
                      </p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={copyAddress}
                          >
                            {copied ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{copied ? 'Copied!' : 'Copy address'}</TooltipContent>
                      </Tooltip>
                    </div>

                    <a
                      href={`https://stellar.expert/explorer/testnet/account/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View on Stellar Expert
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats grid */}
            {stats ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-5 pb-5 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Coins className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-green-500">{stats.totalEarned.toLocaleString()}</p>
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
                    <p className="text-2xl font-bold">{stats.bountiesCompleted}</p>
                    <p className="text-xs text-muted-foreground mt-1">Completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-5 pb-5 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-purple-500" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{stats.successRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Success Rate</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-5 pb-5 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-orange-500" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{stats.averageCompletionTime.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Avg. Days</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <p className="text-sm">No activity found for this contributor.</p>
                </CardContent>
              </Card>
            )}

            {/* Activity timeline */}
            {activity.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="relative space-y-0">
                    {activity.map((item, idx) => {
                      const config = ACTIVITY_CONFIG[item.action]
                      const Icon = config.icon
                      const isLast = idx === activity.length - 1

                      return (
                        <li key={item.id} className="flex gap-4">
                          {/* Line + icon */}
                          <div className="flex flex-col items-center">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                              <Icon className={cn('h-4 w-4', config.color)} />
                            </div>
                            {!isLast && <div className="w-px flex-1 bg-border mt-1 mb-1 min-h-[1.5rem]" />}
                          </div>

                          {/* Content */}
                          <div className={cn('pb-6 flex-1 min-w-0', isLast && 'pb-0')}>
                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                              <span className="text-sm font-medium">{config.label}</span>
                              <span className="text-xs text-muted-foreground">{timeAgo(item.timestamp)}</span>
                              {item.reward && item.token && (
                                <Badge variant="success" className="text-xs px-1.5 py-0">
                                  +{item.reward.toLocaleString()} {item.token}
                                </Badge>
                              )}
                            </div>

                            <Link
                              to={`/bounties/${item.bountyId}`}
                              className="text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-1"
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

          {/* ── Right / Sidebar ── */}
          <div className="space-y-4">
            {/* Reputation */}
            {stats && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Reputation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Score</span>
                    <span className="text-2xl font-bold text-primary">{stats.reputationScore}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Global Rank</span>
                    <Badge variant="outline">#{stats.rank}</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">In Progress</span>
                    <span className="font-medium">{stats.bountiesInProgress}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Active bounties */}
            {activeBounties.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    Active Bounties
                    <Badge variant="default" className="text-xs">
                      {activeBounties.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {activeBounties.map(bounty => (
                    <Link
                      key={bounty.id}
                      to={`/bounties/${bounty.id}`}
                      className="block p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <p className="text-sm font-medium line-clamp-1 mb-1">{bounty.title}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{bounty.token}</span>
                        <Badge variant="outline" className="text-xs">
                          {bounty.status === 'claimed' ? 'In Progress' : 'In Review'}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Completed bounties */}
        {completedBounties.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Completed Bounties
              <Badge variant="secondary">{completedBounties.length}</Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedBounties.map(bounty => (
                <BountyCard key={bounty.id} bounty={bounty} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!stats && activity.length === 0 && activeBounties.length === 0 && (
          <Card className="mt-8">
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No activity yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                This contributor hasn't claimed or completed any bounties.
              </p>
              <Button asChild>
                <Link to="/bounties">Browse Open Bounties</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
