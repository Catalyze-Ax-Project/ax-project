import Link from 'next/link'
import { GitCommit, MessagesSquare, GitPullRequestArrow, CheckCircle2 } from 'lucide-react'
import { changes, discussions, proposals, getPluginById, getPluginHref } from '@/lib/mock-data'
import { formatRelative } from '@/lib/date-utils'

type FeedItem = {
  id: string
  type: 'change' | 'discussion-resolved' | 'proposal-merged' | 'discussion-new'
  pluginId: string
  title: string
  author: string
  createdAt: string
}

function buildFeed(): FeedItem[] {
  const items: FeedItem[] = []

  for (const c of changes) {
    items.push({
      id: c.id,
      type: 'change',
      pluginId: c.pluginId,
      title: c.message,
      author: c.author,
      createdAt: c.createdAt,
    })
  }
  for (const d of discussions) {
    if (d.status === 'resolved') {
      items.push({
        id: d.id,
        type: 'discussion-resolved',
        pluginId: d.pluginId,
        title: `의견 반영 완료 — ${d.title}`,
        author: d.author,
        createdAt: d.createdAt,
      })
    }
  }
  for (const p of proposals) {
    if (p.status === 'merged') {
      items.push({
        id: p.id,
        type: 'proposal-merged',
        pluginId: p.pluginId,
        title: `제안 반영됨 — ${p.title}`,
        author: p.author,
        createdAt: p.createdAt,
      })
    }
  }
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

const ICON: Record<FeedItem['type'], React.ReactNode> = {
  change: <GitCommit className="size-3.5" />,
  'discussion-resolved': <CheckCircle2 className="size-3.5" />,
  'proposal-merged': <GitPullRequestArrow className="size-3.5" />,
  'discussion-new': <MessagesSquare className="size-3.5" />,
}

const BADGE_TONE: Record<FeedItem['type'], string> = {
  change: 'bg-muted text-muted-foreground',
  'discussion-resolved': 'bg-emerald-100 text-emerald-700',
  'proposal-merged': 'bg-primary/10 text-primary',
  'discussion-new': 'bg-amber-100 text-amber-700',
}

const TYPE_LABEL: Record<FeedItem['type'], string> = {
  change: '변경',
  'discussion-resolved': '반영 완료',
  'proposal-merged': '제안 반영',
  'discussion-new': '의견',
}

export function UpdateFeed() {
  const items = buildFeed().slice(0, 6)

  return (
    <section className="rounded-xl border border-border bg-background p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">업데이트 피드</h3>
          <p className="text-xs text-muted-foreground">최근 전사 활동 흐름</p>
        </div>
      </div>
      <ul className="space-y-3">
        {items.map((item) => {
          const plugin = getPluginById(item.pluginId)
          return (
            <li key={`${item.type}-${item.id}`}>
              <Link
                href={getPluginHref(item.pluginId)}
                className="group flex items-start gap-3 rounded-md p-2 -mx-2 hover:bg-muted/60"
              >
                <span
                  className={`mt-0.5 inline-flex size-6 items-center justify-center rounded-md ${BADGE_TONE[item.type]}`}
                >
                  {ICON[item.type]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {TYPE_LABEL[item.type]}
                    </span>
                    <span className="font-mono text-xs text-foreground/90">{plugin?.name}</span>
                  </div>
                  <div className="mt-0.5 truncate text-sm text-foreground group-hover:underline">
                    {item.title}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {item.author} · {formatRelative(item.createdAt)}
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
