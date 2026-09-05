import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom'
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

/**
 * Error boundary for React Router routes
 * Catches errors thrown during route loading or rendering
 */
export function RouteErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  let errorMessage = 'An unexpected error occurred'
  let errorStatus = 500
  let errorDetails: string | null = null

  // Handle React Router errors
  if (isRouteErrorResponse(error)) {
    errorStatus = error.status
    errorMessage = error.statusText || errorMessage

    if (error.status === 404) {
      errorMessage = 'Page not found'
      errorDetails = 'The page you are looking for does not exist.'
    } else if (error.status === 403) {
      errorMessage = 'Access denied'
      errorDetails = 'You do not have permission to access this resource.'
    } else if (error.status === 500) {
      errorMessage = 'Internal server error'
      errorDetails = 'Something went wrong on our end. Please try again later.'
    }
  } else if (error instanceof Error) {
    errorMessage = error.message
    errorDetails = error.stack || null
  } else if (typeof error === 'string') {
    errorMessage = error
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">
            {errorStatus === 404 ? 'Page Not Found' : 'Error'}
          </CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorDetails && (
            <p className="text-sm text-muted-foreground">{errorDetails}</p>
          )}

          {/* Error details in development */}
          {process.env.NODE_ENV === 'development' &&
            error instanceof Error &&
            error.stack && (
              <div className="rounded-lg bg-muted p-4">
                <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </div>
            )}

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate(-1)} className="w-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full gap-2"
            >
              <Home className="h-4 w-4" />
              Go to Homepage
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Error code: {errorStatus}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
