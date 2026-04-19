import Link from 'next/link'
import { formatRelative } from '@/lib/date-utils'
import { PROPOSAL_STATUS_LABEL, type Proposal, type ProposalStatus } from '@/lib/mock-data'

const STATUS_TONE: Record<ProposalStatus, string> = {
  open: 'bg-amber-100 text-amber-800',
  'in-review': 'bg-blue-100 text-blue-800',
  merged: 'bg-emerald-100 text-emerald-800',
  closed: 'bg-slate-200 text-slate-700',
}

export function ProposalItem({ proposal }: { proposal: Proposal }) {
  return (
    <Link
      href={`/proposals/${proposal.id}`}
      className="group block rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-foreground group-hover:underline">
            {proposal.title}
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{proposal.description}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{proposal.id}</span>
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
      </div>
    </Link>
  )
}
