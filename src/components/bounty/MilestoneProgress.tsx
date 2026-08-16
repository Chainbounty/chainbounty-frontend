import { CheckCircle2, Circle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Milestone {
  id: string
  title: string
  completed: boolean
  dueDate?: string
}

interface MilestoneProgressProps {
  milestones: Milestone[]
}

export function MilestoneProgress({ milestones }: MilestoneProgressProps) {
  const completed = milestones.filter(m => m.completed).length
  const pct = milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : 0

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          {completed}/{milestones.length} milestones
        </span>
        <span className="text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Individual milestones */}
      <ul className="space-y-2 pt-1">
        {milestones.map((m, idx) => (
          <li key={m.id} className="flex items-start gap-2.5">
            {m.completed ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <span
                className={cn(
                  'text-sm',
                  m.completed && 'line-through text-muted-foreground'
                )}
              >
                {idx + 1}. {m.title}
              </span>
              {m.dueDate && !m.completed && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <Clock className="h-3 w-3" />
                  Due {new Date(m.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
