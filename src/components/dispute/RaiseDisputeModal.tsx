import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Loader2, AlertTriangle, ExternalLink, CheckCircle2, Upload
} from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { FileUploader } from '@/components/bounty/FileUploader'
import { BountyStatusBadge } from '@/components/bounty/BountyStatusBadge'
import { formatReward } from '@/lib/bounty'
import { toast } from '@/hooks/useToast'
import type { Bounty } from '@/types/bounty'
import type { IPFSUploadResult } from '@/lib/ipfs'

const raiseDisputeSchema = z.object({
  reason: z
    .string()
    .min(50, 'Reason must be at least 50 characters')
    .max(1000, 'Reason must be under 1000 characters'),
  evidenceCid: z.string().min(1, 'Evidence upload is required'),
})

type RaiseDisputeFormValues = z.infer<typeof raiseDisputeSchema>
type DisputeStep = 'form' | 'signing' | 'success' | 'error'

interface RaiseDisputeModalProps {
  bounty: Bounty
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (txHash: string) => void
}

export function RaiseDisputeModal({
  bounty,
  open,
  onOpenChange,
  onSuccess,
}: RaiseDisputeModalProps) {
  const [step, setStep] = useState<DisputeStep>('form')
  const [uploadedFile, setUploadedFile] = useState<IPFSUploadResult | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<RaiseDisputeFormValues>({
    resolver: zodResolver(raiseDisputeSchema),
    defaultValues: {
      reason: '',
      evidenceCid: '',
    },
  })

  function handleClose() {
    if (step === 'signing') return
    onOpenChange(false)
    setTimeout(() => {
      setStep('form')
      setUploadedFile(null)
      setTxHash(null)
      setErrorMessage(null)
      form.reset()
    }, 300)
  }

  async function onSubmit(values: RaiseDisputeFormValues) {
    if (!uploadedFile) {
      form.setError('evidenceCid', { message: 'Please upload evidence' })
      return
    }

    setStep('signing')
    setErrorMessage(null)

    try {
      // Simulate contract call
      await new Promise(res => setTimeout(res, 2000))

      const mockTxHash = Array.from({ length: 64 }, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('')

      setTxHash(mockTxHash)
      setStep('success')
      onSuccess?.(mockTxHash)

      toast({
        variant: 'success',
        title: 'Dispute submitted',
        description: 'Your dispute will be reviewed by community arbitrators.',
      })
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to raise dispute')
      setStep('error')

      toast({
        variant: 'destructive',
        title: 'Dispute submission failed',
        description: err instanceof Error ? err.message : 'Failed to raise dispute. Please try again.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">

        {/* ── Step: Form ── */}
        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Raise Dispute
              </DialogTitle>
              <DialogDescription>
                Submit a formal dispute with evidence. A community review process will determine the outcome.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Bounty summary */}
              <div className="rounded-lg border bg-muted/40 p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold line-clamp-2">{bounty.title}</p>
                  <BountyStatusBadge status={bounty.status} className="shrink-0" />
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reward at stake</span>
                  <span className="font-bold text-orange-500">{formatReward(bounty.reward, bounty.token)}</span>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dispute Reason *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Clearly explain why you are disputing. Include specific details about what was agreed vs. what was delivered..."
                            className="min-h-[120px] resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length ?? 0}/1000 characters (min 50)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="evidenceCid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Evidence *</FormLabel>
                        <FormControl>
                          <FileUploader
                            onUploadComplete={result => {
                              setUploadedFile(result)
                              field.onChange(result.cid)
                            }}
                            onRemove={() => {
                              setUploadedFile(null)
                              field.onChange('')
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Screenshots, logs, or documentation proving your claim (uploaded to IPFS)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Warning */}
                  <div className="flex gap-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 p-3">
                    <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Disputes are reviewed by community arbitrators. Frivolous disputes may result in
                      reputation penalties. Both parties will have a chance to present their case.
                    </p>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button type="submit" className="gap-2 bg-orange-500 hover:bg-orange-600">
                      <AlertTriangle className="h-4 w-4" />
                      Submit Dispute
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </>
        )}

        {/* ── Step: Signing ── */}
        {step === 'signing' && (
          <div className="flex flex-col items-center gap-5 py-8 px-4 text-center">
            <div className="h-16 w-16 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
            </div>
            <div>
              <p className="font-semibold text-lg">Submitting dispute</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please approve the transaction in your Freighter wallet.
              </p>
            </div>
          </div>
        )}

        {/* ── Step: Success ── */}
        {step === 'success' && (
          <>
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="h-16 w-16 rounded-full bg-orange-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-xl">Dispute Submitted</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your dispute has been recorded on-chain and will be reviewed by community arbitrators.
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
                  View transaction
                </a>
              )}

              <div className="w-full rounded-lg bg-muted/50 border p-3 text-sm text-left space-y-1">
                <p className="font-medium text-foreground">What happens next:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                  <li>Community arbitrators will review the evidence</li>
                  <li>Both parties can submit additional statements</li>
                  <li>A resolution vote will determine the outcome</li>
                  <li>Funds will be distributed based on the decision</li>
                </ol>
              </div>
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
                <p className="font-bold text-xl">Submission Failed</p>
                <p className="text-sm text-muted-foreground mt-1">{errorMessage}</p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={() => setStep('form')}>Try Again</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
