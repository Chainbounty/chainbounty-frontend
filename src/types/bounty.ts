export type BountyStatus =
  | 'open'
  | 'claimed'
  | 'in_review'
  | 'completed'
  | 'disputed'
  | 'cancelled'

export type BountyToken = 'XLM' | 'USDC' | 'AQUA'

export interface Bounty {
  id: string
  title: string
  description: string
  repoUrl: string
  issueUrl: string
  issueNumber: number
  repoName: string        // e.g. "stellar/js-stellar-sdk"
  organization: string
  status: BountyStatus
  reward: number
  token: BountyToken
  tags: string[]
  postedBy: string        // Stellar address
  claimedBy: string | null
  createdAt: string       // ISO date string
  expiresAt: string | null
  milestonesTotal: number
  milestonesCompleted: number
}
