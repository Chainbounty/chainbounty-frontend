import { Link } from 'react-router-dom'
import {
  Flag, Send, CheckCircle2, XCircle, AlertTriangle, Wallet, Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useWallet } from '@/contexts/WalletContext'
import type { Bounty } from '@/types/bounty'
import { formatReward } from '@/lib/bounty'

interface BountyActionPanelProps {
  bounty: Bounty
  onClaim?: () => void
  onSubmitWork?: () => void
  onApprove?: () => void
  onReject?: () => void
  onDispute?: () => void
}

export function BountyActionPanel({
  bounty,
  onClaim,
  onSubmitWork,
  onApprove,
  onReject,
  onDispute,
}: BountyActionPanelProps) {
  const { isConnected, address, connect } = useWallet()

  const isPoster   = isConnected && address === bounty.postedBy
  const isClaimer  = isConnected && address === bounty.claimedBy

  // Wallet not connected
  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Connect to Interact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Connect your Freighter wallet to claim, submit work, or manage this bounty.
          </p>
          <Button className="w-full gap-2" onClick={connect}>
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Reward summary */}
        <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
          <span className="text-sm text-muted-foreground">Reward</span>
          <span className="font-bold text-primary">
            {formatReward(bounty.reward, bounty.token)}
          </span>
        </div>

        <Separator />

        {/* OPEN — anyone (not poster) can claim */}
        {bounty.status === 'open' && !isPoster && (
          <Button className="w-full gap-2" onClick={onClaim}>
            <Flag className="h-4 w-4" />
            Claim Bounty
          </Button>
        )}

        {/* OPEN — poster sees locked state */}
        {bounty.status === 'open' && isPoster && (
          <p className="text-sm text-muted-foreground text-center py-1">
            Waiting for a contributor to claim.
          </p>
        )}

        {/* CLAIMED — claimer can submit work */}
        {bounty.status === 'claimed' && isClaimer && (
          <Button className="w-full gap-2" onClick={onSubmitWork}>
            <Send className="h-4 w-4" />
            Submit Work
          </Button>
        )}

        {/* CLAIMED — poster sees it's in progress */}
        {bounty.status === 'claimed' && isPoster && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
            <Lock className="h-4 w-4" />
            Waiting for submission
          </div>
        )}

        {/* IN REVIEW — poster can approve or reject */}
        {bounty.status === 'in_review' && isPoster && (
          <div className="flex flex-col gap-2">
            <Button className="w-full gap-2" onClick={onApprove}>
              <CheckCircle2 className="h-4 w-4" />
              Approve & Release
            </Button>
            <Button variant="destructive" className="w-full gap-2" onClick={onReject}>
              <XCircle className="h-4 w-4" />
              Request Changes
            </Button>
          </div>
        )}

        {/* IN REVIEW — claimer waits */}
        {bounty.status === 'in_review' && isClaimer && (
          <p className="text-sm text-muted-foreground text-center py-1">
            Work is under review by the poster.
          </p>
        )}

        {/* COMPLETED */}
        {bounty.status === 'completed' && (
          <div className="flex items-center gap-2 text-sm text-green-600 justify-center font-medium">
            <CheckCircle2 className="h-4 w-4" />
            Bounty completed
          </div>
        )}

        {/* DISPUTED — both parties */}
        {bounty.status === 'disputed' && (
          <div className="flex items-center gap-2 text-sm text-orange-500 justify-center font-medium">
            <AlertTriangle className="h-4 w-4" />
            Dispute in progress
          </div>
        )}

        {/* Raise dispute — available to claimer during review */}
        {bounty.status === 'in_review' && isClaimer && (
          <>
            <Separator />
            <Button
              variant="outline"
              className="w-full gap-2 text-orange-500 border-orange-500/50 hover:bg-orange-500/10"
              onClick={onDispute}
            >
              <AlertTriangle className="h-4 w-4" />
              Raise Dispute
            </Button>
          </>
        )}

        {/* Dispute center link */}
        {(bounty.status === 'disputed') && (
          <Button variant="outline" className="w-full" asChild>
            <Link to="/disputes">View Dispute Center</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
