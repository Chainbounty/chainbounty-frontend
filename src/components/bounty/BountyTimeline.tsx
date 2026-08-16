import {
  CheckCircle2,
  Circle,
  GitPullRequest,
  AlertTriangle,
  XCircle,
  Coins,
  Flag,
  Shield,
  Zap,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { shortAddress, timeAgo } from '@/lib/bounty'
import type { TimelineEvent, TimelineEventType } from '@/types/timeline'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

const EVENT_CONFIG: Record<
  TimelineEventType,
  { icon: React.ElementType; color: string; bgColor: string; label: string }
> = {
  created:           { icon: Zap,            color: 'text-primary',     bgColor: 'bg-primary/10',     label: 'Bounty Created' },
  claimed:           { icon: Flag,           color: 'text-yellow-500',  bgColor: 'bg-yellow-500/10',  label: 'Bounty Claimed' },
  milestone_completed: { icon: CheckCircle2, color: 'text-green-500',   bgColor: 'bg-green-500/10',   label: 'Milestone Completed' },
  work_submitted:    { icon: GitPullRequest, color: 'text-blue-500',    bgColor: 'bg-blue-500/10',    label: 'Work Submitted' },
  approved:          { icon: CheckCircle2,   color: 'text-green-600',   bgColor: 'bg-green-600/10',   label: 'Work Approved' },
  rejected:          { icon: XCircle,        color: 'text-destructive', bgColor: 'bg-destructive/10', label: 'Work Rejected' },
  disputed:          { icon: AlertTriangle,  color: 'text-orange-500',  bgColor: 'bg-orange-500/10',  label: 'Dispute Raised' },
  dispute_resolved:  { icon: Shield,         color: 'text-purple-500',  bgColor: 'bg-purple-500/10',  label: 'Dispute Resolved' },
  cancelled:         { icon: XCircle,        color: 'text-muted-foreground', bgColor: 'bg-muted',     label: 'Bounty Cancelled' },
  completed:         { icon: Coins,          color: 'text-green-600',   bgColor: 'bg-green-600/10',   label: 'Bounty Completed' },
}

interface BountyTimelineProps {
  events: TimelineEvent[]
}

export function BountyTimeline({ events }: BountyTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
        <Circle className="h-4 w-4" />
        No activity yet.
      </div>
    )
  }

  return (
    <ol className="relative space-y-0">
      {events.map((event, idx) => {
        const config = EVENT_CONFIG[event.type]
        const Icon = config.icon
        const isLast = idx === events.length - 1

        return (
          <li key={event.id} className="flex gap-4">
            {/* Line + icon */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  config.bgColor
                )}
              >
                <Icon className={cn('h-4 w-4', config.color)} />
              </div>
              {!isLast && <div className="w-px flex-1 bg-border mt-1 mb-1 min-h-[1.5rem]" />}
            </div>

            {/* Content */}
            <div className={cn('pb-6 flex-1 min-w-0', isLast && 'pb-0')}>
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="text-sm font-medium">{config.label}</span>
                <span className="text-xs text-muted-foreground">{timeAgo(event.createdAt)}</span>
              </div>

              <p className="text-sm text-muted-foreground mb-1.5">{event.message}</p>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Actor */}
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[10px]">
                      {event.actor.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Link
                    to={`/profile/${event.actor}`}
                    className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
                  >
                    {shortAddress(event.actor)}
                  </Link>
                </div>

                {/* Tx hash */}
                {event.txHash && (
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-primary hover:underline"
                  >
                    <Badge variant="outline" className="text-xs px-1.5 py-0 gap-1">
                      tx: {event.txHash.slice(0, 8)}…
                    </Badge>
                  </a>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
