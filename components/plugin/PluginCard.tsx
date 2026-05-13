import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { KIND_LABEL, TEAM_LABEL, getPluginHref, type Plugin } from '@/lib/mock-data'
import { formatRelative } from '@/lib/date-utils'

type PluginCardProps = {
  plugin: Plugin
  href?: string
}

export function PluginCard({ plugin, href }: PluginCardProps) {
  const targetHref = href ?? getPluginHref(plugin)

  return (
    <Link
      href={targetHref}
      className="group flex flex-col rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/50 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5 text-foreground/70">
              {KIND_LABEL[plugin.kind]}
            </span>
            <span>·</span>
            <span>{TEAM_LABEL[plugin.team]}</span>
          </div>
          <div className="mt-2 truncate text-sm font-semibold text-foreground">
            {plugin.name}
          </div>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{plugin.description}</p>

      <div className="mt-3 flex flex-wrap gap-1">
        {plugin.tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-1">
          <StatBadge letter="D" count={plugin.discussionsCount} title={`의견 ${plugin.discussionsCount}`} />
          <StatBadge letter="P" count={plugin.proposalsCount} title={`제안 ${plugin.proposalsCount}`} />
          <StatBadge letter="C" count={plugin.adoptionCount} title={`반영(Changes) ${plugin.adoptionCount}`} />
        </div>
        <div className="text-[11px] text-muted-foreground">
          {formatRelative(plugin.updatedAt)}
        </div>
      </div>
    </Link>
  )
}

function StatBadge({ letter, count, title }: { letter: string; count: number; title: string }) {
  return (
    <span
      title={title}
      className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-foreground"
    >
      <span className="text-muted-foreground">{letter}</span>
      <span>{count}</span>
    </span>
  )
}
