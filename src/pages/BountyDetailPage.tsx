import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ExternalLink, GitBranch, Clock, User,
  Coins, Calendar, Copy, Check
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { BountyStatusBadge } from '@/components/bounty/BountyStatusBadge'
import { BountyTimeline } from '@/components/bounty/BountyTimeline'
import { MilestoneProgress } from '@/components/bounty/MilestoneProgress'
import { BountyActionPanel } from '@/components/bounty/BountyActionPanel'
import { ClaimBountyModal } from '@/components/bounty/ClaimBountyModal'
import { ApproveRejectModal } from '@/components/bounty/ApproveRejectModal'
import { LiveIndicator } from '@/components/ui/live-indicator'
import { useBountyPolling } from '@/hooks/useBountyPolling'
import { MOCK_TIMELINE, MOCK_MILESTONES } from '@/lib/mockData'
import { formatReward, shortAddress, timeAgo } from '@/lib/bounty'

export default function BountyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [claimModalOpen, setClaimModalOpen] = useState(false)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)

  // Poll for bounty updates every 10 seconds
  const { bounty, lastUpdated } = useBountyPolling(id, 10000)
  const timeline = MOCK_TIMELINE[id ?? ''] ?? []
  const milestones = MOCK_MILESTONES[id ?? ''] ?? []

  if (!bounty) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Bounty not found</h2>
        <p className="text-muted-foreground mb-6">
          This bounty may have been removed or the ID is incorrect.
        </p>
        <Button asChild>
          <Link to="/bounties">Browse Bounties</Link>
        </Button>
      </div>
    )
  }

  function copyAddress(addr: string) {
    navigator.clipboard.writeText(addr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const expiresAt = bounty.expiresAt ? new Date(bounty.expiresAt) : null
  const isExpired = expiresAt ? expiresAt < new Date() : false
  const daysLeft = expiresAt
    ? Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <TooltipProvider>
      <div className="container py-8 max-w-6xl">
        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bounties
        </Button>

        {/* Live indicator */}
        <div className="flex justify-end mb-4">
          <LiveIndicator lastUpdated={lastUpdated} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left / Main ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title card */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                {/* Repo + issue */}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <GitBranch className="h-4 w-4 shrink-0" />
                  <span className="font-mono">{bounty.repoName}</span>
                  <span>#{bounty.issueNumber}</span>
                  <a
                    href={bounty.issueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                    aria-label="Open GitHub issue"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                {/* Title + status */}
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-2xl font-bold leading-snug">{bounty.title}</h1>
                  <BountyStatusBadge status={bounty.status} className="shrink-0 mt-1" />
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {bounty.description}
                </p>

                {/* Tags */}
                {bounty.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {bounty.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Separator />

                {/* Meta row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  {/* Reward */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Coins className="h-3.5 w-3.5" /> Reward
                    </p>
                    <p className="font-bold text-primary">
                      {formatReward(bounty.reward, bounty.token)}
                    </p>
                  </div>

                  {/* Posted */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Posted
                    </p>
                    <p className="font-medium">{timeAgo(bounty.createdAt)}</p>
                  </div>

                  {/* Expires */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Expires
                    </p>
                    {expiresAt ? (
                      <p className={`font-medium ${isExpired ? 'text-destructive' : daysLeft! <= 3 ? 'text-orange-500' : ''}`}>
                        {isExpired ? 'Expired' : `${daysLeft}d left`}
                      </p>
                    ) : (
                      <p className="text-muted-foreground">No expiry</p>
                    )}
                  </div>

                  {/* Organization */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <GitBranch className="h-3.5 w-3.5" /> Org
                    </p>
                    <p className="font-medium truncate">{bounty.organization}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs: Timeline | Milestones */}
            <Tabs defaultValue="timeline">
              <TabsList>
                <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
                <TabsTrigger value="milestones">
                  Milestones ({bounty.milestonesCompleted}/{bounty.milestonesTotal})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timeline">
                <Card>
                  <CardContent className="pt-6">
                    <BountyTimeline events={timeline} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="milestones">
                <Card>
                  <CardContent className="pt-6">
                    {milestones.length > 0 ? (
                      <MilestoneProgress milestones={milestones} />
                    ) : (
                      <p className="text-sm text-muted-foreground">No milestones defined.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* ── Right / Sidebar ── */}
          <div className="space-y-4">
            {/* Action panel */}
            <BountyActionPanel
              bounty={bounty}
              onClaim={() => setClaimModalOpen(true)}
              onSubmitWork={() => navigate(`/bounties/${id}/submit`)}
              onApprove={() => setApproveModalOpen(true)}
              onReject={() => setRejectModalOpen(true)}
              onDispute={() => navigate('/disputes')}
            />

            {/* Claim modal */}
            <ClaimBountyModal
              bounty={bounty}
              open={claimModalOpen}
              onOpenChange={setClaimModalOpen}
              onSuccess={txHash => {
                console.log('Claimed! tx:', txHash)
                setClaimModalOpen(false)
              }}
            />

            {/* Approve modal */}
            <ApproveRejectModal
              bounty={bounty}
              action="approve"
              open={approveModalOpen}
              onOpenChange={setApproveModalOpen}
              onSuccess={(action, txHash) => {
                console.log(`${action} tx:`, txHash)
                setApproveModalOpen(false)
                // In real app, refetch bounty to update status
              }}
            />

            {/* Reject modal */}
            <ApproveRejectModal
              bounty={bounty}
              action="reject"
              open={rejectModalOpen}
              onOpenChange={setRejectModalOpen}
              onSuccess={(action, txHash) => {
                console.log(`${action} tx:`, txHash)
                setRejectModalOpen(false)
              }}
            />

            {/* Poster info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Posted By</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {bounty.postedBy.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/profile/${bounty.postedBy}`}
                      className="text-sm font-mono hover:text-primary transition-colors truncate block"
                    >
                      {shortAddress(bounty.postedBy)}
                    </Link>
                    <p className="text-xs text-muted-foreground">Bounty poster</p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => copyAddress(bounty.postedBy)}
                        aria-label="Copy address"
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{copied ? 'Copied!' : 'Copy address'}</TooltipContent>
                  </Tooltip>
                </div>

                {/* View on Stellar Expert */}
                <a
                  href={`https://stellar.expert/explorer/testnet/account/${bounty.postedBy}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View on Stellar Expert
                </a>
              </CardContent>
            </Card>

            {/* Claimer info */}
            {bounty.claimedBy && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Claimed By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {bounty.claimedBy.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/profile/${bounty.claimedBy}`}
                        className="text-sm font-mono hover:text-primary transition-colors truncate block"
                      >
                        {shortAddress(bounty.claimedBy)}
                      </Link>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <User className="h-3 w-3" /> Contributor
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
