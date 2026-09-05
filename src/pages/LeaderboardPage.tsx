import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Trophy, Medal, Award, TrendingUp, TrendingDown, Minus, Coins,
  Target, BarChart3, ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { shortAddress } from '@/lib/bounty'
import { MOCK_LEADERBOARD, type LeaderboardEntry } from '@/lib/mockData'
import { cn } from '@/lib/utils'

type SortBy = 'rank' | 'earned' | 'completed' | 'successRate'

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<SortBy>('rank')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data load
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const sorted = [...MOCK_LEADERBOARD].sort((a, b) => {
    switch (sortBy) {
      case 'rank':
        return a.rank - b.rank
      case 'earned':
        return b.totalEarned - a.totalEarned
      case 'completed':
        return b.bountiesCompleted - a.bountiesCompleted
      case 'successRate':
        return b.successRate - a.successRate
      default:
        return 0
    }
  })

  const topThree = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  // Aggregate stats
  const totalEarned = MOCK_LEADERBOARD.reduce((sum, e) => sum + e.totalEarned, 0)
  const totalCompleted = MOCK_LEADERBOARD.reduce((sum, e) => sum + e.bountiesCompleted, 0)
  const avgSuccessRate = (
    MOCK_LEADERBOARD.reduce((sum, e) => sum + e.successRate, 0) / MOCK_LEADERBOARD.length
  ).toFixed(1)

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
          <Trophy className="h-7 w-7 text-yellow-500" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Top contributors ranked by reputation and bounty performance
        </p>
      </div>

      {/* Aggregate stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {isLoading ? (
          <>
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-7 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-7 w-20" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardContent className="pt-5 pb-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <Coins className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalEarned.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Earned (USDC)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 pb-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCompleted}</p>
                  <p className="text-xs text-muted-foreground">Bounties Completed</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 pb-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                </div>
                <div>
              <p className="text-2xl font-bold">{avgSuccessRate}%</p>
              <p className="text-xs text-muted-foreground">Avg Success Rate</p>
            </div>
          </CardContent>
        </Card>
          </>
        )}
      </div>

      {/* Top 3 podium */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Top Contributors</CardTitle>
          <CardDescription>Hall of fame — our highest performing contributors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topThree.map((entry, idx) => {
              const icons = [Trophy, Medal, Award]
              const colors = [
                'text-yellow-500 bg-yellow-500/10',
                'text-gray-400 bg-gray-400/10',
                'text-orange-600 bg-orange-600/10',
              ]
              const Icon = icons[idx]
              return (
                <Link
                  key={entry.address}
                  to={`/profile/${entry.address}`}
                  className="flex flex-col items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className={cn('h-14 w-14 rounded-full flex items-center justify-center', colors[idx])}>
                    <Icon className={cn('h-7 w-7', colors[idx].split(' ')[0])} />
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="mb-2">
                      Rank #{entry.rank}
                    </Badge>
                    <Avatar className="h-12 w-12 mx-auto mb-2">
                      <AvatarFallback className="text-sm font-bold">
                        {entry.address.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-mono text-xs text-muted-foreground mb-2">
                      {shortAddress(entry.address)}
                    </p>
                    <div className="flex items-center justify-center gap-3 text-xs">
                      <div className="text-center">
                        <p className="font-bold text-green-500">{entry.totalEarned.toLocaleString()}</p>
                        <p className="text-muted-foreground">Earned</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{entry.bountiesCompleted}</p>
                        <p className="text-muted-foreground">Completed</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Full leaderboard table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">All Rankings</CardTitle>
            <Tabs value={sortBy} onValueChange={v => setSortBy(v as SortBy)}>
              <TabsList className="h-8">
                <TabsTrigger value="rank" className="text-xs">Rank</TabsTrigger>
                <TabsTrigger value="earned" className="text-xs">Earned</TabsTrigger>
                <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
                <TabsTrigger value="successRate" className="text-xs">Success %</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={10} columns={7} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Contributor</TableHead>
                  <TableHead className="text-right">Earned</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Completed</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Success Rate</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">Reputation</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map(entry => (
                  <TableRow key={entry.address} className="group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1.5">
                      #{entry.rank}
                      {entry.change > 0 && (
                        <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                      )}
                      {entry.change < 0 && (
                        <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                      )}
                      {entry.change === 0 && (
                        <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/profile/${entry.address}`}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">
                          {entry.address.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-mono text-sm">{shortAddress(entry.address)}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-green-500">
                    {entry.totalEarned.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell">
                    {entry.bountiesCompleted}
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    {entry.successRate.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right hidden lg:table-cell">
                    <Badge variant="outline" className="text-xs">
                      {entry.reputationScore}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/profile/${entry.address}`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                      aria-label="View profile"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
