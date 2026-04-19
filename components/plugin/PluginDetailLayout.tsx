import Link from 'next/link'
import { ArrowLeft, CalendarClock } from 'lucide-react'
import { PluginTabs } from './PluginTabs'
import {
  KIND_LABEL,
  TEAM_LABEL,
  getDiscussionsByPlugin,
  getProposalsByPlugin,
  getChangesByPlugin,
  members,
  type Plugin,
} from '@/lib/mock-data'
import { formatRelative } from '@/lib/date-utils'

type Props = {
  plugin: Plugin
  backHref: string
  backLabel: string
  headerSlot?: React.ReactNode
}

export function PluginDetailLayout({ plugin, backHref, backLabel, headerSlot }: Props) {
  const discussions = getDiscussionsByPlugin(plugin.id)
  const proposals = getProposalsByPlugin(plugin.id)
  const changes = getChangesByPlugin(plugin.id)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {backLabel}
      </Link>

      <header className="flex flex-col gap-4 rounded-xl border border-border bg-background p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5 text-foreground/70">
              {KIND_LABEL[plugin.kind]}
            </span>
            <span>·</span>
            <span>{TEAM_LABEL[plugin.team]}</span>
          </div>
          <h2 className="mt-2 font-mono text-2xl font-semibold tracking-tight">{plugin.name}</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{plugin.description}</p>
          {plugin.tags && plugin.tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {plugin.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="shrink-0 rounded-lg border border-border bg-muted/30 px-4 py-3 text-right text-xs">
          <div className="flex items-center justify-end gap-1 text-muted-foreground">
            <CalendarClock className="size-3.5" />
            마지막 업데이트
          </div>
          <div className="mt-0.5 text-sm font-medium text-foreground">
            {formatRelative(plugin.updatedAt)}
          </div>
        </div>
      </header>

      {headerSlot}

      <PluginTabs
        plugin={plugin}
        discussions={discussions}
        proposals={proposals}
        changes={changes}
        memberTotal={members.length}
      />
    </div>
  )
}
