import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  AlertTriangle, ExternalLink, Users, Scale, CheckCircle2, Clock, FileText
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { shortAddress, timeAgo } from '@/lib/bounty'
import { DISPUTE_STATUS_CONFIG } from '@/lib/dispute'
import { MOCK_DISPUTES } from '@/lib/mockData'
import type { DisputeStatus } from '@/types/dispute'
import { cn } from '@/lib/utils'

type FilterStatus = DisputeStatus | 'all'

export default function DisputeCenterPage() {
  const [filter, setFilter] = useState<FilterStatus>('all')

  const filtered =
    filter === 'all'
      ? MOCK_DISPUTES
      : MOCK_DISPUTES.filter(d => d.status === filter)

  const openCount = MOCK_DISPUTES.filter(d => d.status === 'open').length
  const underReviewCount = MOCK_DISPUTES.filter(d => d.status === 'under_review').length
  const resolvedCount = MOCK_DISPUTES.filter(d =>
    d.status.startsWith('resolved_')
  ).length

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
          <Scale className="h-7 w-7 text-orange-500" />
          Dispute Center
        </h1>
        <p className="text-muted-foreground text-sm">
          Community-driven resolution for bounty conflicts
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5 pb-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{openCount}</p>
              <p className="text-xs text-muted-foreground">Open Disputes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{underReviewCount}</p>
              <p className="text-xs text-muted-foreground">Under Review</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{resolvedCount}</p>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter tabs */}
      <Tabs value={filter} onValueChange={v => setFilter(v as FilterStatus)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All ({MOCK_DISPUTES.length})</TabsTrigger>
          <TabsTrigger value="open">Open ({openCount})</TabsTrigger>
          <TabsTrigger value="under_review">Under Review ({underReviewCount})</TabsTrigger>
          <TabsTrigger value="resolved_poster">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Disputes list */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(dispute => {
            const statusConfig = DISPUTE_STATUS_CONFIG[dispute.status]
            const isResolved = dispute.status.startsWith('resolved_')

            return (
              <Card key={dispute.id} className={cn(isResolved && 'opacity-75')}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base">
                          <Link
                            to={`/bounties/${dispute.bountyId}`}
                            className="hover:text-primary transition-colors line-clamp-1"
                          >
                            {dispute.bountyTitle}
                          </Link>
                        </CardTitle>
                      </div>
                      <CardDescription className="flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Opened {timeAgo(dispute.createdAt)}
                        </span>
                        {dispute.resolvedAt && (
                          <>
                            <span>•</span>
                            <span>Resolved {timeAgo(dispute.resolvedAt)}</span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Parties */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">
                          {dispute.poster.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs text-muted-foreground">Poster</p>
                        <Link
                          to={`/profile/${dispute.poster}`}
                          className="font-mono text-xs hover:text-primary transition-colors"
                        >
                          {shortAddress(dispute.poster)}
                        </Link>
                      </div>
                    </div>

                    <div className="text-muted-foreground">vs</div>

                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">
                          {dispute.claimer.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs text-muted-foreground">Claimer</p>
                        <Link
                          to={`/profile/${dispute.claimer}`}
                          className="font-mono text-xs hover:text-primary transition-colors"
                        >
                          {shortAddress(dispute.claimer)}
                        </Link>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Reason */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <FileText className="h-3 w-3" /> Dispute Reason
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">{dispute.reason}</p>
                  </div>

                  {/* Evidence */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Evidence:</span>
                    <a
                      href={`https://ipfs.io/ipfs/${dispute.evidence}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline font-mono"
                    >
                      {dispute.evidence.slice(0, 12)}...
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Votes (if under review or resolved) */}
                  {(dispute.status === 'under_review' || isResolved) && (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Votes for poster:</span>
                        <Badge variant="outline" className="text-xs">
                          {dispute.votesForPoster}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Votes for claimer:</span>
                        <Badge variant="outline" className="text-xs">
                          {dispute.votesForClaimer}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Resolution */}
                  {dispute.resolution && (
                    <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-3">
                      <p className="text-xs font-medium text-green-600 mb-1">Resolution</p>
                      <p className="text-sm text-foreground">{dispute.resolution}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/bounties/${dispute.bountyId}`}>View Bounty</Link>
                    </Button>
                    {dispute.status === 'under_review' && (
                      <Button size="sm" variant="secondary">
                        View Full Case
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No disputes found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === 'all'
                ? 'No disputes have been raised yet.'
                : `No ${filter.replace('_', ' ')} disputes.`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info card */}
      <Card className="mt-8 border-primary/40 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            How Dispute Resolution Works
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            1. <strong>Submit:</strong> Either party can raise a dispute with supporting evidence (uploaded to IPFS)
          </p>
          <p>
            2. <strong>Review:</strong> Community arbitrators with reputation ≥500 can vote on the outcome
          </p>
          <p>
            3. <strong>Resolution:</strong> Votes are tallied after 7 days. Funds are distributed based on majority decision
          </p>
          <p className="text-xs pt-2">
            Possible outcomes: full release to poster, full release to claimer, or split distribution
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
