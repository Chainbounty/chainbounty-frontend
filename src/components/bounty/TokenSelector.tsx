import { Coins } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BountyToken } from '@/types/bounty'

const TOKENS: { value: BountyToken; label: string; description: string; color: string }[] = [
  {
    value: 'XLM',
    label: 'XLM',
    description: 'Stellar Lumens',
    color: 'text-blue-500 border-blue-500 bg-blue-500/10',
  },
  {
    value: 'USDC',
    label: 'USDC',
    description: 'USD Coin',
    color: 'text-green-500 border-green-500 bg-green-500/10',
  },
  {
    value: 'AQUA',
    label: 'AQUA',
    description: 'Aquarius',
    color: 'text-purple-500 border-purple-500 bg-purple-500/10',
  },
]

interface TokenSelectorProps {
  value: BountyToken | ''
  onChange: (token: BountyToken) => void
  disabled?: boolean
}

export function TokenSelector({ value, onChange, disabled }: TokenSelectorProps) {
  return (
    <div className="flex gap-3" role="radiogroup" aria-label="Select reward token">
      {TOKENS.map(token => {
        const isSelected = value === token.value
        return (
          <button
            key={token.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(token.value)}
            className={cn(
              'flex-1 flex flex-col items-center gap-1.5 rounded-lg border-2 px-3 py-3 text-sm transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              isSelected
                ? token.color
                : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
            )}
          >
            <Coins className="h-5 w-5" />
            <span className="font-bold">{token.label}</span>
            <span className="text-xs opacity-75">{token.description}</span>
          </button>
        )
      })}
    </div>
  )
}
