'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { PluginCard } from './PluginCard'
import { KIND_LABEL, type Plugin, type PluginKind } from '@/lib/mock-data'

type Props = {
  plugins: Plugin[]
}

const KIND_ORDER: PluginKind[] = ['client', 'context', 'action']
const VISIBLE_KINDS = new Set<PluginKind>(['client', 'context', 'action'])

export function PluginsMarket({ plugins }: Props) {
  const [query, setQuery] = useState('')
  // 디폴트로 client 카테고리부터.
  const [activeKind, setActiveKind] = useState<PluginKind>('client')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const market = useMemo(
    () => plugins.filter((p) => VISIBLE_KINDS.has(p.kind)),
    [plugins],
  )

  const allTags = useMemo(
    () => Array.from(new Set(market.flatMap((p) => p.tags ?? []))).sort(),
    [market],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return market.filter((p) => {
      if (p.kind !== activeKind) return false
      if (activeTag && !(p.tags ?? []).includes(activeTag)) return false
      if (!q) return true
      const hay = [p.name, p.description, ...(p.tags ?? [])]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [market, query, activeKind, activeTag])

  const kindCounts = useMemo(() => {
    const m = new Map<PluginKind, number>()
    for (const p of market) m.set(p.kind, (m.get(p.kind) ?? 0) + 1)
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
          <Chip
            key={k}
            label={KIND_LABEL[k]}
            count={kindCounts.get(k) ?? 0}
            active={activeKind === k}
            onClick={() => setActiveKind(k)}
            emphasized
          />
        ))}
      </div>

      {allTags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => {
            const count = market.filter((p) => (p.tags ?? []).includes(tag)).length
            if (count === 0) return null
            return (
              <Chip
                key={tag}
                label={tag}
                count={count}
                active={activeTag === tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              />
            )
          })}
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

function Chip({
  label,
  count,
  active,
  onClick,
  emphasized,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
  emphasized?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground'
          : emphasized
            ? 'inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-medium hover:bg-muted'
            : 'inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-[11px] text-foreground/80 hover:bg-muted/60'
      }
    >
      {label}
      <span className="tabular-nums text-[10px] opacity-70">{count}</span>
    </button>
  )
}
