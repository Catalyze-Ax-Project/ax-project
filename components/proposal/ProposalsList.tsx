'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  PROPOSAL_STATUS_LABEL,
  type Plugin,
  type Proposal,
  type ProposalStatus,
} from '@/lib/mock-data'
import { formatRelative } from '@/lib/date-utils'

type Filter = 'all' | ProposalStatus
const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'open', label: '대기중' },
  { value: 'in-review', label: '검토중' },
  { value: 'merged', label: '반영됨' },
  { value: 'closed', label: '닫힘' },
]

const STATUS_TONE: Record<ProposalStatus, string> = {
  open: 'bg-amber-100 text-amber-800',
  'in-review': 'bg-blue-100 text-blue-800',
  merged: 'bg-emerald-100 text-emerald-800',
  closed: 'bg-slate-200 text-slate-700',
}

type Props = {
  proposals: Proposal[]
  pluginById: Record<string, { id: string; name: string; kind: Plugin['kind'] }>
}

export function ProposalsList({ proposals: allProposals, pluginById }: Props) {
  const [filter, setFilter] = useState<Filter>('all')

  const counts = useMemo(() => {
    const map: Record<Filter, number> = { all: allProposals.length, open: 0, 'in-review': 0, merged: 0, closed: 0 }
    for (const p of allProposals) map[p.status] += 1
    return map
  }, [allProposals])

  const filtered = useMemo(
    () =>
      [...allProposals]
        .filter((p) => filter === 'all' || p.status === filter)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [filter, allProposals],
  )

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={
              filter === f.value
                ? 'inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground'
                : 'inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-muted'
            }
          >
            {f.label}
            <span
              className={
                filter === f.value
                  ? 'tabular-nums font-semibold'
                  : 'tabular-nums text-muted-foreground'
              }
            >
              {counts[f.value]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background p-10 text-center text-sm text-muted-foreground">
          해당 상태의 제안이 없습니다.
        </div>
      ) : (
        <ul className="overflow-hidden rounded-xl border border-border bg-background">
          {filtered.map((p, idx) => (
            <li
              key={p.id}
              className={idx === filtered.length - 1 ? '' : 'border-b border-border'}
            >
              <ProposalRow proposal={p} pluginName={pluginById[p.pluginId]?.name} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function ProposalRow({ proposal, pluginName }: { proposal: Proposal; pluginName?: string }) {
  return (
    <Link
      href={`/proposals/${proposal.id}`}
      className="group flex items-start justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground group-hover:underline">
          {proposal.title}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span>{pluginName}</span>
          <span>·</span>
          <span>{proposal.author}</span>
          <span>·</span>
          <span>{formatRelative(proposal.createdAt)}</span>
        </div>
      </div>
      <span
        className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-medium ${STATUS_TONE[proposal.status]}`}
      >
        {PROPOSAL_STATUS_LABEL[proposal.status]}
      </span>
    </Link>
  )
}
