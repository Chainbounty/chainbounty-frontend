import type { DisputeStatus } from '@/types/dispute'

export const DISPUTE_STATUS_CONFIG: Record<
  DisputeStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }
> = {
  open:             { label: 'Open',             variant: 'warning' },
  under_review:     { label: 'Under Review',     variant: 'default' },
  resolved_poster:  { label: 'Resolved (Poster)', variant: 'success' },
  resolved_claimer: { label: 'Resolved (Claimer)', variant: 'success' },
  resolved_split:   { label: 'Resolved (Split)', variant: 'secondary' },
}
