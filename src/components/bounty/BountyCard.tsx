import { Link } from 'react-router-dom'
import { GitBranch, ExternalLink, Clock, User, Coins, Tag } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BountyStatusBadge } from './BountyStatusBadge'
import { formatReward, shortAddress, timeAgo } from '@/lib/bounty'
import type { Bounty } from '@/types/bounty'
import { cn } from '@/lib/utils'

interface BountyCardProps {
  bounty: Bounty
  className?: string
}

export function BountyCard({ bounty, className }: BountyCardProps) {
  const {
    id,
    title,
    description,
    repoName,
    issueUrl,
    issueNumber,
    status,
    reward,
    token,
    tags,
    postedBy,
    createdAt,
    expiresAt,
    milestonesTotal,
    milestonesCompleted,
  } = bounty

  const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false
  const progressPct =
    milestonesTotal > 0 ? Math.round((milestonesCompleted / milestonesTotal) * 100) : 0

  return (
    <Card
      className={cn(
        'flex flex-col transition-shadow hover:shadow-md',
        isExpired && 'opacity-60',
        className
      )}
    >
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Repo + issue */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
              <GitBranch className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate font-mono">{repoName}</span>
              <span className="shrink-0">#{issueNumber}</span>
              <a
                href={issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 hover:text-primary transition-colors"
                onClick={e => e.stopPropagation()}
                aria-label="Open GitHub issue"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Title */}
            <Link
              to={`/bounties/${id}`}
              className="font-semibold text-sm leading-snug hover:text-primary transition-colors line-clamp-2"
            >
              {title}
            </Link>
          </div>

          <BountyStatusBadge status={status} className="shrink-0 mt-0.5" />
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{description}</p>
      </CardHeader>

      <CardContent className="pb-3 flex-1 space-y-3">
        {/* Reward */}
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-primary shrink-0" />
          <span className="font-bold text-base">{formatReward(reward, token)}</span>
        </div>

        {/* Milestone progress */}
        {milestonesTotal > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Milestones</span>
              <span>
                {milestonesCompleted}/{milestonesTotal} ({progressPct}%)
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {tags.slice(0, 4).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                {tag}
              </Badge>
            ))}
            {tags.length > 4 && (
              <span className="text-xs text-muted-foreground">+{tags.length - 4}</span>
            )}
          </div>
        )}
      </CardContent>

      <Separator />

      {/* Footer */}
      <CardFooter className="pt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground min-w-0">
          {/* Posted by */}
          <div className="flex items-center gap-1 min-w-0">
            <User className="h-3.5 w-3.5 shrink-0" />
            <Link
              to={`/profile/${postedBy}`}
              className="font-mono hover:text-primary transition-colors truncate"
              onClick={e => e.stopPropagation()}
            >
              {shortAddress(postedBy)}
            </Link>
          </div>

          {/* Time */}
          <div className="flex items-center gap-1 shrink-0">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeAgo(createdAt)}</span>
          </div>

          {/* Expiry warning */}
          {expiresAt && isExpired && (
            <Badge variant="destructive" className="text-xs px-1.5 py-0 shrink-0">
              Expired
            </Badge>
          )}
        </div>

        <Button size="sm" variant={status === 'open' ? 'default' : 'outline'} asChild>
          <Link to={`/bounties/${id}`}>
            {status === 'open' ? 'Claim' : 'View'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
