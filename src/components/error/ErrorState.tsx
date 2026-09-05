import { AlertTriangle, RefreshCw, Wifi, Server, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

export type ErrorType = 'network' | 'server' | 'not-found' | 'unauthorized' | 'generic'

interface ErrorStateProps {
  type?: ErrorType
  title?: string
  message?: string
  retry?: () => void
  className?: string
  compact?: boolean
}

const errorConfig: Record<
  ErrorType,
  { icon: React.ComponentType<{ className?: string }>; defaultTitle: string; defaultMessage: string }
> = {
  network: {
    icon: Wifi,
    defaultTitle: 'Connection error',
    defaultMessage: 'Unable to connect to the server. Please check your internet connection.',
  },
  server: {
    icon: Server,
    defaultTitle: 'Server error',
    defaultMessage: 'The server encountered an error. Please try again later.',
  },
  'not-found': {
    icon: AlertCircle,
    defaultTitle: 'Not found',
    defaultMessage: 'The requested resource could not be found.',
  },
  unauthorized: {
    icon: AlertTriangle,
    defaultTitle: 'Unauthorized',
    defaultMessage: 'You do not have permission to access this resource.',
  },
  generic: {
    icon: AlertTriangle,
    defaultTitle: 'Something went wrong',
    defaultMessage: 'An unexpected error occurred. Please try again.',
  },
}

/**
 * Reusable error state component for inline errors
 * Use in place of content when an error occurs
 */
export function ErrorState({
  type = 'generic',
  title,
  message,
  retry,
  className,
  compact = false,
}: ErrorStateProps) {
  const config = errorConfig[type]
  const Icon = config.icon
  const displayTitle = title || config.defaultTitle
  const displayMessage = message || config.defaultMessage

  if (compact) {
    return (
      <Alert variant="destructive" className={cn('', className)}>
        <Icon className="h-4 w-4" />
        <AlertTitle>{displayTitle}</AlertTitle>
        <AlertDescription className="flex items-center justify-between gap-4">
          <span>{displayMessage}</span>
          {retry && (
            <Button
              variant="outline"
              size="sm"
              onClick={retry}
              className="shrink-0 gap-2"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <Icon className="h-8 w-8 text-destructive" />
      </div>

      <h3 className="text-lg font-semibold mb-2">{displayTitle}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">{displayMessage}</p>

      {retry && (
        <Button onClick={retry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}
