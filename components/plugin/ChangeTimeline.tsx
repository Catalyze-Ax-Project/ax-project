import { GitCommit } from 'lucide-react'
import { formatRelative } from '@/lib/date-utils'
import type { Change } from '@/lib/mock-data'

export function ChangeTimeline({ changes }: { changes: Change[] }) {
  const sorted = [...changes].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  if (sorted.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-background p-8 text-center text-sm text-muted-foreground">
        아직 변경 이력이 없습니다.
      </div>
    )
  }

  return (
    <ol className="space-y-0">
      {sorted.map((change, idx) => {
        const isLast = idx === sorted.length - 1
        return (
          <li key={change.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="grid size-6 place-items-center rounded-full border border-border bg-background">
                <GitCommit className="size-3 text-muted-foreground" />
              </div>
              {isLast ? null : <div className="w-px flex-1 bg-border" />}
            </div>
            <div className={isLast ? 'pb-0' : 'pb-5'}>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{change.id}</span>
              </div>
              <div className="text-sm text-foreground">{change.message}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {change.author} · {formatRelative(change.createdAt)}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
