export type TimelineEventType =
  | 'created'
  | 'claimed'
  | 'milestone_completed'
  | 'work_submitted'
  | 'approved'
  | 'rejected'
  | 'disputed'
  | 'dispute_resolved'
  | 'cancelled'
  | 'completed'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  actor: string        // Stellar address
  message: string
  txHash?: string      // on-chain tx hash if applicable
  createdAt: string    // ISO date string
}
