import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground text-lg mb-8">
        Page not found. The bounty you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  )
}
