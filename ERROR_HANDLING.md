# Error Handling & Error Boundaries Implementation

## Overview
Comprehensive error handling system with error boundaries, inline error states, retry mechanisms, and graceful degradation throughout the ChainBounty frontend.

## Files Created

### Error Boundary Components

1. **src/components/error/ErrorBoundary.tsx**
   - Class-based React error boundary
   - Catches JavaScript errors anywhere in child component tree
   - Shows fallback UI with error details (dev mode)
   - Provides Try Again, Reload Page, and Go Home actions
   - Supports custom fallback UI via props
   - Optional error logging callback

2. **src/components/error/RouteErrorBoundary.tsx**
   - Error boundary specifically for React Router
   - Handles route loading errors (404, 403, 500, etc.)
   - Uses `useRouteError()` hook
   - Contextual error messages based on status code
   - Navigation actions (Go Back, Go Home)

3. **src/components/error/ErrorState.tsx**
   - Reusable inline error component
   - 5 error types: network, server, not-found, unauthorized, generic
   - Two modes: full (centered) and compact (alert)
   - Retry button integration
   - Configurable title and message

### UI Components

4. **src/components/ui/alert.tsx**
   - shadcn/ui Alert component
   - 4 variants: default, destructive, warning, success
   - AlertTitle and AlertDescription subcomponents
   - Used for inline warnings and errors

## Files Modified

### App Integration

1. **src/App.tsx**
   - Wrapped entire app in `<ErrorBoundary>`
   - Catches top-level rendering errors
   - Prevents white screen of death

### Polling Hooks with Error Handling

2. **src/hooks/useBountyListPolling.ts**
   - Added `error` state
   - Returns `{ bounties, isLoading, error, lastUpdated, refetch }`
   - Catches and stores fetch errors
   - Allows retry via `refetch` function

3. **src/hooks/useBountyPolling.ts**
   - Added `error` state
   - Returns `{ bounty, isLoading, error, lastUpdated, refetch }`
   - Catches and stores fetch errors
   - Allows retry via `refetch` function

### Pages with Error States

4. **src/pages/BountyListPage.tsx**
   - Shows `<ErrorState>` when fetch fails
   - Includes retry button that calls `refetch()`
   - Graceful fallback to error UI

5. **src/pages/BountyDetailPage.tsx**
   - Shows `<ErrorState>` when bounty fetch fails
   - Includes retry button
   - Separate error vs not-found handling

## Error Handling Patterns

### 1. Error Boundary (Component Tree Errors)

**When to Use**: Catch errors in component rendering, lifecycle methods, and constructor

```typescript
import { ErrorBoundary } from '@/components/error/ErrorBoundary'

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

**With Custom Fallback**:
```typescript
<ErrorBoundary fallback={<div>Custom error UI</div>}>
  <MyComponent />
</ErrorBoundary>
```

**With Error Logging**:
```typescript
<ErrorBoundary onError={(error, errorInfo) => {
  logErrorToService(error, errorInfo)
}}>
  <MyComponent />
</ErrorBoundary>
```

### 2. Inline Error States (Async Operations)

**When to Use**: Show error state when data fetching fails

```typescript
const { data, isLoading, error, refetch } = useDataFetch()

if (isLoading) return <Skeleton />
if (error) return <ErrorState type="network" retry={refetch} />

return <DataDisplay data={data} />
```

**Compact Mode** (inside a card or section):
```typescript
{error && (
  <ErrorState 
    type="network" 
    message={error.message}
    retry={refetch}
    compact
  />
)}
```

### 3. Error Types

| Type | Icon | Use Case | Default Message |
|------|------|----------|-----------------|
| `network` | Wifi | Connection failures, timeout | "Unable to connect to the server" |
| `server` | Server | 500 errors, backend issues | "The server encountered an error" |
| `not-found` | AlertCircle | 404 errors, missing resources | "The requested resource could not be found" |
| `unauthorized` | AlertTriangle | 403 errors, permissions | "You do not have permission to access this resource" |
| `generic` | AlertTriangle | Unknown/other errors | "An unexpected error occurred" |

### 4. Async Hook Pattern with Error Handling

```typescript
export function useDataFetch() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch('/api/data')
      if (!response.ok) throw new Error('Fetch failed')
      const result = await response.json()
      setData(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { data, isLoading, error, refetch: fetchData }
}
```

## Error Recovery Mechanisms

### 1. Retry Button
All error states include a retry button that calls the refetch function:
```typescript
<ErrorState 
  type="network"
  retry={() => refetch()}
/>
```

### 2. Reload Page
For critical errors, offer page reload:
```typescript
<Button onClick={() => window.location.reload()}>
  Reload Page
</Button>
```

### 3. Navigation Fallback
Allow users to navigate away from error:
```typescript
<Button onClick={() => navigate('/')}>
  Go to Homepage
</Button>
```

## Error Logging (Future)

### Production Error Tracking

```typescript
// In ErrorBoundary or error handlers
function logErrorToService(error: Error, errorInfo?: ErrorInfo) {
  // Sentry
  Sentry.captureException(error, {
    contexts: {
      react: { componentStack: errorInfo?.componentStack }
    }
  })

  // Or custom analytics
  analytics.track('error', {
    message: error.message,
    stack: error.stack,
    component: errorInfo?.componentStack
  })
}
```

### User Context

```typescript
// Add user info to error logs
Sentry.setUser({
  id: userAddress,
  username: shortAddress(userAddress)
})
```

## Testing Error Handling

### Manual Testing

1. **Network Errors**: Throttle network to offline in DevTools
2. **Component Errors**: Throw error in component to trigger boundary
3. **404 Errors**: Navigate to non-existent route
4. **API Errors**: Mock API to return error responses

### Simulating Errors

```typescript
// Add to any component for testing
if (Math.random() < 0.1) {
  throw new Error('Simulated error for testing')
}
```

### Testing Error Boundaries

```typescript
// Test with React Testing Library
it('shows error boundary fallback', () => {
  const ThrowError = () => {
    throw new Error('Test error')
  }

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  )

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
})
```

## Best Practices

### ✅ DO

- Always handle errors in async operations
- Provide retry mechanisms
- Show user-friendly error messages
- Log errors for debugging
- Test error states in development
- Use specific error types when possible
- Provide escape routes (navigation)

### ❌ DON'T

- Show raw stack traces to end users (only in dev)
- Ignore errors silently
- Use generic "error occurred" without context
- Block users without recovery options
- Forget to clean up error state
- Display technical jargon to non-technical users

## Error State Hierarchy

```
1. Critical (App-breaking) → ErrorBoundary
   └─ Shows full-page error with reload option

2. Page-level (Data fetch fails) → ErrorState (full)
   └─ Shows centered error with retry button

3. Section-level (Partial failure) → ErrorState (compact)
   └─ Shows inline alert, rest of page works

4. Field-level (Form validation) → Form error messages
   └─ Red text below input field
```

## Accessibility

- Error messages use `role="alert"` for screen readers
- Retry buttons are keyboard accessible
- Error text has sufficient color contrast
- Focus management after errors occur
- ARIA labels on action buttons

## Future Enhancements

1. **Error Recovery Strategies**
   - Automatic retry with exponential backoff
   - Stale-while-revalidate pattern
   - Optimistic updates with rollback

2. **Enhanced Error Tracking**
   - Integration with Sentry/Rollbar
   - Error rate monitoring
   - User session replay on errors

3. **Smart Error Messages**
   - Contextual help based on error type
   - Suggested actions ("Try these steps...")
   - Link to relevant documentation

4. **Offline Support**
   - Detect offline state
   - Queue actions for later
   - Show offline indicator

5. **Error Analytics Dashboard**
   - Track error frequency
   - Identify problematic components
   - Monitor error resolution time

## Production Checklist

- [ ] All async operations have error handling
- [ ] Error boundaries wrap major app sections
- [ ] Error logging service integrated
- [ ] User-friendly error messages (no stack traces)
- [ ] Retry mechanisms in place
- [ ] Error states tested manually
- [ ] Accessibility verified
- [ ] Error monitoring dashboard set up
