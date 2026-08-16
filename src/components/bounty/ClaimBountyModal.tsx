import { useState } from 'react'
import { Loader2, Flag, ExternalLink, AlertTriangle, CheckCircle2, Coins, GitBranch, Clock } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BountyStatusBadge } from '@/components/bounty/BountyStatusBadge'
import { formatReward, shortAddress, timeAgo } from '@/lib/bounty'
import { useWallet } from '@/contexts/WalletContext'
import type { Bounty } from '@/types/bounty'
import { cn } from '@/lib/utils'

type ClaimStep = 'confirm' | 'signing' | 'success' | 'error'

interface ClaimBountyModalProps {
  bounty: Bounty
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (txHash: string) => void
}

export function ClaimBountyModal({
  bounty,
  open,
  onOpenChange,
  onSuccess,
}: ClaimBountyModalProps) {
  const { address, shortAddress: walletShortAddress } = useWallet()
  const [step, setStep] = useState<ClaimStep>('confirm')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function handleClose() {
    // Only allow close when not mid-signing
    if (step === 'signing') return
    onOpenChange(false)
    // Reset after animation
    setTimeout(() => {
      setStep('confirm')
      setTxHash(null)
      setErrorMessage(null)
    }, 300)
  }

  async function handleClaim() {
    setStep('signing')
    setErrorMessage(null)

    try {
      // Simulate Freighter signing + contract call
      await new Promise(res => setTimeout(res, 2000))

      // Simulate occasional error for demo (5% chance)
      if (Math.random() < 0.05) throw new Error('User rejected transaction in Freighter.')

      const mockTxHash = Array.from({ length: 64 }, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('')

      setTxHash(mockTxHash)
      setStep('success')
      onSuccess?.(mockTxHash)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Transaction failed. Please try again.')
      setStep('error')
    }
  }

  const perMilestone =
    bounty.milestonesTotal > 0
      ? (bounty.reward / bounty.milestonesTotal).toLocaleString()
      : null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">

        {/* ── Step: Confirm ── */}
        {step === 'confirm' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-primary" />
                Claim Bounty
              </DialogTitle>
              <DialogDescription>
                Review the details before claiming. This will lock the bounty to your address on-chain.
              </DialogDescription>
            </DialogHeader>

            {/* Bounty summary */}
            <div className="space-y-4 py-2">
              <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
                {/* Title + status */}
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold leading-snug line-clamp-2">{bounty.title}</p>
                  <BountyStatusBadge status={bounty.status} className="shrink-0" />
                </div>

                {/* Repo */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <GitBranch className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-mono">{bounty.repoName}</span>
                  <span>#{bounty.issueNumber}</span>
                  <a
                    href={bounty.issueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                    aria-label="Open issue"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <Separator />

                {/* Reward */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Coins className="h-3.5 w-3.5" /> Total Reward
                  </span>
                  <span className="font-bold text-primary">{formatReward(bounty.reward, bounty.token)}</span>
                </div>

                {/* Per milestone */}
                {perMilestone && bounty.milestonesTotal > 1 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Per milestone</span>
                    <span className="text-sm font-medium">{perMilestone} {bounty.token}</span>
                  </div>
                )}

                {/* Milestones */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Milestones</span>
                  <Badge variant="outline" className="text-xs">{bounty.milestonesTotal}</Badge>
                </div>

                {/* Expiry */}
                {bounty.expiresAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Posted
                    </span>
                    <span className="text-xs">{timeAgo(bounty.createdAt)}</span>
                  </div>
                )}
              </div>

              {/* Claiming as */}
              {address && (
                <div className="flex items-center gap-3 rounded-lg border px-3 py-2.5 bg-background">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px]">
                      {address.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Claiming as</p>
                    <p className="text-sm font-mono truncate">{walletShortAddress}</p>
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="flex gap-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-3">
                <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Claiming locks this bounty to your wallet. You'll need to submit work for review
                  to receive the reward. Only one contributor can hold a claim at a time.
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleClaim} className="gap-2">
                <Flag className="h-4 w-4" />
                Confirm Claim
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── Step: Signing ── */}
        {step === 'signing' && (
          <div className="flex flex-col items-center gap-5 py-8 px-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <div>
              <p className="font-semibold text-lg">Waiting for signature</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please approve the transaction in your Freighter wallet extension.
              </p>
            </div>
            <div className="flex gap-1.5">
              {['Preparing tx', 'Awaiting signature', 'Broadcasting'].map((label, i) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={cn(
                    'h-2 w-2 rounded-full animate-pulse',
                    i === 0 ? 'bg-primary' : 'bg-muted'
                  )} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                  {i < 2 && <span className="text-muted-foreground">→</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step: Success ── */}
        {step === 'success' && (
          <>
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="font-bold text-xl">Bounty Claimed!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You've successfully claimed <span className="font-semibold text-foreground">{bounty.title}</span>.
                </p>
              </div>

              {txHash && (
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  View transaction on Stellar Expert
                </a>
              )}

              <div className="w-full rounded-lg bg-muted/50 border p-3 text-sm text-muted-foreground text-left space-y-1">
                <p className="font-medium text-foreground">Next steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Complete the work described in the GitHub issue</li>
                  <li>Submit your work via the "Submit Work" form</li>
                  <li>Wait for the bounty poster to review and approve</li>
                  <li>Receive <span className="font-semibold text-primary">{formatReward(bounty.reward, bounty.token)}</span> when approved</li>
                </ol>
              </div>
            </div>

            <DialogFooter>
              <Button className="w-full" onClick={handleClose}>
                Got it
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── Step: Error ── */}
        {step === 'error' && (
          <>
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <p className="font-bold text-xl">Transaction Failed</p>
                <p className="text-sm text-muted-foreground mt-1">{errorMessage}</p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={() => setStep('confirm')}>Try Again</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
