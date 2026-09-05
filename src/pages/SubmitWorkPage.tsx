import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft, Send, Loader2, Info, ExternalLink, Wallet, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { FileUploader } from '@/components/bounty/FileUploader'
import { BountyCard } from '@/components/bounty/BountyCard'
import { useWallet } from '@/contexts/WalletContext'
import { MOCK_BOUNTIES } from '@/lib/mockData'
import { submitWorkSchema, type SubmitWorkFormValues } from '@/lib/schemas'
import type { IPFSUploadResult } from '@/lib/ipfs'

export default function SubmitWorkPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isConnected, address, connect } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<IPFSUploadResult | null>(null)

  const bounty = MOCK_BOUNTIES.find(b => b.id === id)

  const form = useForm<SubmitWorkFormValues>({
    resolver: zodResolver(submitWorkSchema),
    defaultValues: {
      prUrl: '',
      notes: '',
      completedMilestones: bounty?.milestonesTotal ?? 1,
      ipfsCid: '',
    },
  })

  if (!bounty) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Bounty not found</h2>
        <Button asChild className="mt-4">
          <Link to="/bounties">Browse Bounties</Link>
        </Button>
      </div>
    )
  }

  // Gate: only claimer or status check
  const isClaimer = isConnected && address === bounty.claimedBy
  if (bounty.status !== 'claimed' || (isConnected && !isClaimer)) {
    return (
      <div className="container py-20 text-center max-w-md">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Not authorized</h2>
        <p className="text-muted-foreground mb-6">
          Only the contributor who claimed this bounty can submit work.
        </p>
        <Button asChild>
          <Link to={`/bounties/${id}`}>View Bounty</Link>
        </Button>
      </div>
    )
  }

  async function onSubmit(values: SubmitWorkFormValues) {
    if (!isConnected) {
      await connect()
      return
    }
    if (!uploadedFile) {
      form.setError('ipfsCid', { message: 'Please upload a file' })
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate contract call
      await new Promise(res => setTimeout(res, 1500))
      console.log('Submitting work:', { ...values, ipfsCid: uploadedFile.cid })
      navigate(`/bounties/${id}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const prUrl = form.watch('prUrl')
  const repoName = (() => {
    try {
      const url = new URL(prUrl)
      const parts = url.pathname.split('/').filter(Boolean)
      return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : null
    } catch {
      return null
    }
  })()

  return (
    <div className="container py-8 max-w-3xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Submit Work</h1>
        <p className="text-muted-foreground text-sm">
          Submit your completed work for review. The bounty poster will approve or request changes.
        </p>
      </div>

      {/* Wallet gate */}
      {!isConnected && (
        <Card className="mb-6 border-primary/40 bg-primary/5">
          <CardContent className="flex items-center justify-between gap-4 pt-5 pb-5">
            <div>
              <p className="font-medium text-sm">Wallet required</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Connect your wallet to submit work for this bounty.
              </p>
            </div>
            <Button size="sm" onClick={connect} className="gap-2 shrink-0">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bounty preview */}
      <BountyCard bounty={bounty} className="mb-6" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* ── Section: PR Link ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pull Request</CardTitle>
              <CardDescription>Link to your GitHub PR that resolves the issue.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="prUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PR URL *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="https://github.com/org/repo/pull/123"
                          {...field}
                        />
                        {repoName && (
                          <a
                            href={prUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                            aria-label="Open PR"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </FormControl>
                    {repoName && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Info className="h-3 w-3" />
                        Repo: <span className="font-mono">{repoName}</span>
                      </p>
                    )}
                    <FormDescription>
                      Your PR should clearly address the bounty requirements
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ── Section: Notes ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Submission Notes</CardTitle>
              <CardDescription>Explain what you've done and how you tested it.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your approach, what you implemented, how you tested it, and any relevant context for the reviewer..."
                        className="min-h-[120px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length ?? 0}/1000 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ── Section: File Upload ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Supporting Materials</CardTitle>
              <CardDescription>
                Upload screenshots, documentation, or test results (stored on IPFS)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="ipfsCid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload File *</FormLabel>
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
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      File is uploaded to IPFS for decentralized, permanent storage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ── Section: Milestones (optional) ── */}
          {bounty.milestonesTotal > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Milestone Progress</CardTitle>
                <CardDescription>
                  How many milestones have you completed? (Total: {bounty.milestonesTotal})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="completedMilestones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Completed Milestones</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3">
                          <Input
                            type="number"
                            min={1}
                            max={bounty.milestonesTotal}
                            {...field}
                            onChange={e => field.onChange(e.target.valueAsNumber)}
                            className="w-24"
                          />
                          <span className="text-sm text-muted-foreground">
                            of {bounty.milestonesTotal}
                          </span>
                          {field.value === bounty.milestonesTotal && (
                            <Badge variant="success" className="text-xs">All done!</Badge>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Partial work can be submitted for incremental review
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Submit */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/bounties/${id}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isConnected || !uploadedFile}
              className="gap-2 min-w-[160px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Work
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
