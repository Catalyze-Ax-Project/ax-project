import Link from 'next/link'
import { Flame } from 'lucide-react'
import { clientPlugins, discussions, proposals, changes } from '@/lib/mock-data'
import { isWithinWeek } from '@/lib/date-utils'

type Row = {
  pluginId: string
  name: string
  description: string
  activity: number
  d: number
  p: number
  c: number
}

export function ClientTemperature() {
  const rows: Row[] = clientPlugins.map((client) => {
    const d = discussions.filter((x) => x.pluginId === client.id && isWithinWeek(x.createdAt)).length
    const p = proposals.filter((x) => x.pluginId === client.id && isWithinWeek(x.createdAt)).length
    const c = changes.filter((x) => x.pluginId === client.id && isWithinWeek(x.createdAt)).length
    return {
      pluginId: client.id,
      name: client.name,
      description: client.description,
      activity: d + p + c,
      d,
      p,
      c,
    }
  })
  const max = Math.max(...rows.map((r) => r.activity), 1)

  return (
    <section className="rounded-xl border border-border bg-background p-5">
      <div className="mb-4 flex items-center gap-2">
        <Flame className="size-4 text-primary" />
        <div>
          <h3 className="text-sm font-semibold">클라이언트 온도</h3>
          <p className="text-xs text-muted-foreground">이번 주 클라이언트별 활동량</p>
        </div>
      </div>
      <ul className="space-y-4">
        {rows.map((row) => (
          <li key={row.pluginId}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <Link
                href={`/clients/${row.pluginId}`}
                className="font-mono text-foreground hover:underline"
              >
                {row.name}
              </Link>
              <span className="text-xs text-muted-foreground">
                의견 <b className="text-foreground">{row.d}</b> · 제안 <b className="text-foreground">{row.p}</b> · 변경 <b className="text-foreground">{row.c}</b>
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-all"
                style={{ width: `${Math.max(6, (row.activity / max) * 100)}%` }}
              />
            </div>
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{row.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
