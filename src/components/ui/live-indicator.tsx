import { Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface LiveIndicatorProps {
  lastUpdated: Date | null
  className?: string
}

export function LiveIndicator({ lastUpdated, className }: LiveIndicatorProps) {
  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'Never'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-1.5 text-xs text-muted-foreground cursor-default',
              className
            )}
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </div>
            <Activity className="h-3 w-3" />
            <span>Live</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Last updated: {timeStr}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
