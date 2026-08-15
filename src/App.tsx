import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ChainBounty
            <Badge variant="default">Beta</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm">
            Decentralized Bounty Board for Open Source
          </p>
          <div className="flex gap-2">
            <Button>Connect Wallet</Button>
            <Button variant="outline">Browse Bounties</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
