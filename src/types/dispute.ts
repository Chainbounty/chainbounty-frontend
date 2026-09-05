export type DisputeStatus = 'open' | 'under_review' | 'resolved_poster' | 'resolved_claimer' | 'resolved_split'

export interface Dispute {
  id: string
  bountyId: string
  bountyTitle: string
  poster: string
  claimer: string
  reason: string
  evidence: string // IPFS CID
  status: DisputeStatus
  createdAt: string
  resolvedAt?: string
  resolution?: string
  votesForPoster: number
  votesForClaimer: number
}
