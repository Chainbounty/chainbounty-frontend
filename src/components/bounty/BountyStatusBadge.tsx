import { memo } from 'react'
import { Badge } from '@/components/ui/badge'
import { STATUS_CONFIG } from '@/lib/bounty'
import type { BountyStatus } from '@/types/bounty'

interface BountyStatusBadgeProps {
  status: BountyStatus
  className?: string
}

export const BountyStatusBadge = memo(function BountyStatusBadge({ status, className }: BountyStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
})
