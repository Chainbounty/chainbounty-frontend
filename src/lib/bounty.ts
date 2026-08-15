import type { BountyStatus, BountyToken } from '@/types/bounty'

export const STATUS_CONFIG: Record<
  BountyStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }
> = {
  open:       { label: 'Open',       variant: 'success' },
  claimed:    { label: 'Claimed',    variant: 'warning' },
  in_review:  { label: 'In Review',  variant: 'default' },
  completed:  { label: 'Completed',  variant: 'secondary' },
  disputed:   { label: 'Disputed',   variant: 'destructive' },
  cancelled:  { label: 'Cancelled',  variant: 'outline' },
}

export const TOKEN_SYMBOLS: Record<BountyToken, string> = {
  XLM:  'XLM',
  USDC: 'USDC',
  AQUA: 'AQUA',
}

/** Shorten a Stellar address: GABC...XYZ */
export function shortAddress(address: string): string {
  if (address.length <= 10) return address
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

/** Format reward amount, e.g. 1000 XLM */
export function formatReward(amount: number, token: BountyToken): string {
  return `${amount.toLocaleString()} ${TOKEN_SYMBOLS[token]}`
}

/** Relative time, e.g. "3 days ago" */
export function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}
