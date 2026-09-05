import { useState } from 'react'
import * as React from 'react'
import { Loader2, CheckCircle2, XCircle, AlertTriangle, ExternalLink, Send } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BountyStatusBadge } from '@/components/bounty/BountyStatusBadge'
import { formatReward } from '@/lib/bounty'
import { toast } from '@/hooks/useToast'
import type { Bounty } from '@/types/bounty'
import { cn } from '@/lib/utils'

type ReviewStep = 'confirm' | 'signing' | 'success' | 'error'
type ReviewAction = 'approve' | 'reject'

interface ApproveRejectModalProps {
  bounty: Bounty
  action: ReviewAction
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (action: ReviewAction, txHash: string) => void
}

export function ApproveRejectModal({
  bounty,
  action,
  open,
  onOpenChange,
  onSuccess,
}: ApproveRejectModalProps) {
  const [step, setStep] = useState<ReviewStep>('confirm')
  const [feedback, setFeedback] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function handleClose() {
    if (step === 'signing') return
    onOpenChange(false)
    setTimeout(() => {
      setStep('confirm')
      setFeedback('')
      setTxHash(null)
      setErrorMessage(null)
    }, 300)
  }

  async function handleSubmit() {
    if (action === 'reject' && feedback.trim().length < 10) {
      setErrorMessage('Please provide feedback (at least 10 characters)')
      return
    }

    setStep('signing')
    setErrorMessage(null)

    try {
      // Simulate contract call
      await new Promise(res => setTimeout(res, 2000))

      // Simulate occasional error
      if (Math.random() < 0.05) throw new Error('Transaction rejected in wallet')

      const mockTxHash = Array.from({ length: 64 }, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('')

      setTxHash(mockTxHash)
      setStep('success')
      onSuccess?.(action, mockTxHash)

      toast({
        variant: isApprove ? 'success' : 'default',
        title: isApprove ? 'Work approved!' : 'Changes requested',
        description: isApprove
          ? `Reward of ${formatReward(bounty.reward, bounty.token)} has been released.`
          : 'The contributor has been notified.',
      })
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Transaction failed')
      setStep('error')

      toast({
        variant: 'destructive',
        title: 'Transaction failed',
        description: err instanceof Error ? err.message : 'Transaction failed. Please try again.',
      })
    }
  }

  const isApprove = action === 'approve'
  const actionLabel = isApprove ? 'Approve' : 'Request Changes'
  const actionIcon = isApprove ? CheckCircle2 : XCircle
  const actionColor = isApprove ? 'text-green-500' : 'text-orange-500'
  const actionBgColor = isApprove ? 'bg-green-500' : 'bg-orange-500'

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">

        {/* ── Step: Confirm ── */}
        {step === 'confirm' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {React.createElement(actionIcon, { className: cn('h-5 w-5', actionColor) })}
                {actionLabel}
              </DialogTitle>
              <DialogDescription>
                {isApprove
                  ? 'Approve this work and release the bounty reward to the contributor.'
                  : 'Request changes or reject the current submission. The contributor will be notified.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Bounty summary */}
              <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold leading-snug line-clamp-2">{bounty.title}</p>
                  <BountyStatusBadge status={bounty.status} className="shrink-0" />
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reward</span>
                    <span className="font-bold text-primary">{formatReward(bounty.reward, bounty.token)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Contributor</span>
                    <span className="font-mono text-xs">
                      {bounty.claimedBy?.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>

              {/* Feedback textarea */}
              <div className="space-y-2">
                <Label htmlFor="feedback">
                  {isApprove ? 'Feedback (optional)' : 'Feedback *'}
                </Label>
                <Textarea
                  id="feedback"
                  placeholder={
                    isApprove
                      ? 'Optional message to the contributor (e.g. "Great work! Thanks for your contribution.")'
                      : 'Explain what needs to be changed or improved...'
                  }
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  className="min-h-[100px] resize-y"
                />
                {!isApprove && (
                  <p className="text-xs text-muted-foreground">
                    {feedback.length}/1000 characters (min 10 required)
                  </p>
                )}
              </div>

              {/* Warning for approve */}
              {isApprove && (
                <div className="flex gap-2.5 rounded-lg bg-green-500/10 border border-green-500/30 p-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Approving this work will release <span className="font-semibold text-foreground">{formatReward(bounty.reward, bounty.token)}</span> from
                    escrow to the contributor's wallet. This action cannot be undone.
                  </p>
                </div>
              )}

              {/* Warning for reject */}
              {!isApprove && (
                <div className="flex gap-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 p-3">
                  <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The contributor will be notified and can resubmit improved work. If disputes arise,
                    either party can escalate to the dispute resolution process.
                  </p>
                </div>
              )}

              {errorMessage && step === 'confirm' && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className={cn('gap-2', isApprove ? '' : 'bg-orange-500 hover:bg-orange-600')}
              >
                {React.createElement(actionIcon, { className: 'h-4 w-4' })}
                Confirm {actionLabel}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── Step: Signing ── */}
        {step === 'signing' && (
          <div className="flex flex-col items-center gap-5 py-8 px-4 text-center">
            <div className={cn('h-16 w-16 rounded-full flex items-center justify-center', `${actionBgColor}/10`)}>
              <Loader2 className={cn('h-8 w-8 animate-spin', actionColor)} />
            </div>
            <div>
              <p className="font-semibold text-lg">Waiting for signature</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please approve the transaction in your Freighter wallet extension.
              </p>
            </div>
          </div>
        )}

        {/* ── Step: Success ── */}
        {step === 'success' && (
          <>
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className={cn('h-16 w-16 rounded-full flex items-center justify-center', `${actionBgColor}/10`)}>
                {React.createElement(actionIcon, { className: cn('h-8 w-8', actionColor) })}
              </div>
              <div>
                <p className="font-bold text-xl">
                  {isApprove ? 'Work Approved!' : 'Changes Requested'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isApprove
                    ? `Reward of ${formatReward(bounty.reward, bounty.token)} has been released to the contributor.`
                    : 'The contributor has been notified and can resubmit their work.'}
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

              {feedback && (
                <div className="w-full rounded-lg bg-muted/50 border p-3 text-left">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Your feedback:</p>
                  <p className="text-sm text-foreground">{feedback}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button className="w-full" onClick={handleClose}>
                Close
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
