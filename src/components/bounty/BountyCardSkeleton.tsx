import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface BountyCardSkeletonProps {
  className?: string
}

export function BountyCardSkeleton({ className }: BountyCardSkeletonProps) {
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader className="pb-3">
        {/* Repo name and issue */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-12" />
        </div>

        {/* Title and status badge */}
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Reward and progress */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2 w-32 rounded-full" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}
