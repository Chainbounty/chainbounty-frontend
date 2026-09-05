export interface ContributorStats {
  totalEarned: number
  bountiesCompleted: number
  bountiesInProgress: number
  successRate: number
  averageCompletionTime: number // in days
  reputationScore: number
  rank: number
}

export interface ContributorActivity {
  id: string
  bountyId: string
  bountyTitle: string
  action: 'claimed' | 'submitted' | 'approved' | 'disputed'
  reward?: number
  token?: string
  timestamp: string
}
