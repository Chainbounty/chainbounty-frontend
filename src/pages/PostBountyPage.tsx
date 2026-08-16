import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2, Wallet, Info, Plus, Minus, ExternalLink
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
import { TokenSelector } from '@/components/bounty/TokenSelector'
import { useWallet } from '@/contexts/WalletContext'
import { postBountySchema, type PostBountyFormValues } from '@/lib/schemas'
import type { BountyToken } from '@/types/bounty'

export default function PostBountyPage() {
  const navigate = useNavigate()
  const { isConnected, connect } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const form = useForm<PostBountyFormValues>({
    resolver: zodResolver(postBountySchema),
    defaultValues: {
      title: '',
      description: '',
      issueUrl: '',
      reward: undefined,
      token: undefined,
      expiresAt: '',
      milestonesTotal: 1,
    },
  })

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && !tags.includes(t) && tags.length < 8) {
      setTags(prev => [...prev, t])
      setTagInput('')
    }
  }

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag))
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  async function onSubmit(values: PostBountyFormValues) {
    if (!isConnected) {
      await connect()
      return
    }
    setIsSubmitting(true)
    try {
      // Simulate async contract call / API post
      await new Promise(res => setTimeout(res, 1500))
      console.log('Posting bounty:', { ...values, tags })
      // Navigate to the bounty list after posting
      navigate('/bounties')
    } finally {
      setIsSubmitting(false)
    }
  }

  const rewardValue = form.watch('reward')
  const tokenValue  = form.watch('token')
  const milestones  = form.watch('milestonesTotal')

  // Derive repo name from issue URL for preview
  const issueUrl = form.watch('issueUrl')
  const repoName = (() => {
    try {
      const url = new URL(issueUrl)
      const parts = url.pathname.split('/').filter(Boolean)
      return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : null
    } catch {
      return null
    }
  })()

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Post a Bounty</h1>
        <p className="text-muted-foreground text-sm">
          Fund an open source GitHub issue. Reward is held in escrow until approved.
        </p>
      </div>

      {/* Wallet gate */}
      {!isConnected && (
        <Card className="mb-6 border-primary/40 bg-primary/5">
          <CardContent className="flex items-center justify-between gap-4 pt-5 pb-5">
            <div>
              <p className="font-medium text-sm">Wallet required</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Connect your Freighter wallet to post and fund a bounty.
              </p>
            </div>
            <Button size="sm" onClick={connect} className="gap-2 shrink-0">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* ── Section: Issue details ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">GitHub Issue</CardTitle>
              <CardDescription>Link the issue you want contributors to fix.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              <FormField
                control={form.control}
                name="issueUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue URL *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="https://github.com/org/repo/issues/123"
                          {...field}
                        />
                        {repoName && (
                          <a
                            href={issueUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                            aria-label="Open issue"
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bounty Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Fix XDR decoding bug in transaction parser" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, concise title for the bounty ({field.value?.length ?? 0}/120)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what needs to be done, acceptance criteria, and any relevant context..."
                        className="min-h-[120px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length ?? 0}/2000 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ── Section: Reward ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reward</CardTitle>
              <CardDescription>Set the reward amount held in escrow until completion.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token *</FormLabel>
                    <FormControl>
                      <TokenSelector
                        value={field.value ?? ''}
                        onChange={(t: BountyToken) => field.onChange(t)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="500"
                          min={1}
                          {...field}
                          onChange={e => field.onChange(e.target.valueAsNumber)}
                          className="pr-16"
                        />
                        {tokenValue && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                            {tokenValue}
                          </span>
                        )}
                      </div>
                    </FormControl>
                    {rewardValue > 0 && tokenValue && (
                      <p className="text-xs text-muted-foreground">
                        Reward: <span className="font-semibold text-primary">{rewardValue.toLocaleString()} {tokenValue}</span> will be locked in escrow
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ── Section: Milestones & expiry ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Milestones & Deadline</CardTitle>
              <CardDescription>Break the work into milestones and optionally set an expiry.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              <FormField
                control={form.control}
                name="milestonesTotal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Milestones *</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 shrink-0"
                          onClick={() => field.onChange(Math.max(1, (field.value ?? 1) - 1))}
                          aria-label="Decrease milestones"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-bold w-8 text-center">{field.value ?? 1}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 shrink-0"
                          onClick={() => field.onChange(Math.min(10, (field.value ?? 1) + 1))}
                          aria-label="Increase milestones"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          milestone{(milestones ?? 1) !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Reward is split equally across milestones (max 10)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Bounty auto-cancels and funds are returned if unclaimed by this date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ── Section: Tags ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tags</CardTitle>
              <CardDescription>Help contributors find this bounty (max 8 tags).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. bug, typescript, good-first-issue"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  disabled={tags.length >= 8}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= 8}
                >
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 cursor-pointer hover:bg-destructive/20 transition-colors"
                      onClick={() => removeTag(tag)}
                      role="button"
                      aria-label={`Remove tag ${tag}`}
                    >
                      {tag}
                      <span className="text-muted-foreground">×</span>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Submit */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/bounties')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isConnected}
              className="gap-2 min-w-[160px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  Post Bounty
                  {rewardValue > 0 && tokenValue && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {rewardValue.toLocaleString()} {tokenValue}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
