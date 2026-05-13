'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { PluginCard } from './PluginCard'
import {
  KIND_LABEL,
  TEAM_LABEL,
  type Plugin,
  type PluginKind,
  type Team,
} from '@/lib/mock-data'

type Props = {
  plugins: Plugin[]
}

const KIND_ORDER: PluginKind[] = ['client', 'context', 'action']
const VISIBLE_KINDS = new Set<PluginKind>(['client', 'context', 'action'])

const ACTION_TEAM_ORDER: Team[] = ['common', 'bd', 'dev-growth', 'marketing', 'operations']

export function PluginsMarket({ plugins }: Props) {
  const [query, setQuery] = useState('')
  // 디폴트로 client 카테고리부터.
  const [activeKind, setActiveKind] = useState<PluginKind>('client')
  // Action 단계 진입 시에만 의미 있는 카테고리(직무) 필터. null이면 전체.
  const [activeActionTeam, setActiveActionTeam] = useState<Team | null>(null)

  const market = useMemo(
    () => plugins.filter((p) => VISIBLE_KINDS.has(p.kind)),
    [plugins],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return market.filter((p) => {
      if (p.kind !== activeKind) return false
      if (activeKind === 'action' && activeActionTeam && p.team !== activeActionTeam) {
        return false
      }
      if (!q) return true
      const hay = [p.name, p.description, ...(p.tags ?? [])]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [market, query, activeKind, activeActionTeam])

  const kindCounts = useMemo(() => {
    const m = new Map<PluginKind, number>()
    for (const p of market) m.set(p.kind, (m.get(p.kind) ?? 0) + 1)
    return m
  }, [market])

  const actionTeamCounts = useMemo(() => {
    const m = new Map<Team, number>()
    for (const p of market) {
      if (p.kind !== 'action') continue
      m.set(p.team, (m.get(p.team) ?? 0) + 1)
    }
    return m
  }, [market])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름·설명·태그로 검색"
            className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {filtered.length} / {market.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {KIND_ORDER.map((k) => (
          <KindChip
            key={k}
            label={KIND_LABEL[k]}
            count={kindCounts.get(k) ?? 0}
            active={activeKind === k}
            onClick={() => setActiveKind(k)}
          />
        ))}
      </div>

      {activeKind === 'action' ? (
        <div className="flex flex-wrap items-center gap-1.5 border-l-2 border-primary/30 pl-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            카테고리
          </span>
          {ACTION_TEAM_ORDER.map((t) => (
            <TeamChip
              key={t}
              label={TEAM_LABEL[t]}
              count={actionTeamCounts.get(t) ?? 0}
              active={activeActionTeam === t}
              onClick={() =>
                setActiveActionTeam(activeActionTeam === t ? null : t)
              }
            />
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background p-10 text-center text-sm text-muted-foreground">
          검색 결과 없음.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((plugin) => (
            <PluginCard key={plugin.id} plugin={plugin} />
          ))}
        </div>
      )}
    </div>
  )
}

function KindChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground'
          : 'inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-medium hover:bg-muted'
      }
    >
      {label}
      <span className="tabular-nums text-[10px] opacity-70">{count}</span>
    </button>
  )
}

function TeamChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground'
          : 'inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-foreground/80 hover:bg-muted/70'
      }
    >
      {label}
      <span className="tabular-nums text-[9px] opacity-70">{count}</span>
    </button>
  )
}
