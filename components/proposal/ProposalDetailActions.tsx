'use client'

import { Check } from 'lucide-react'
import { useAdmin } from '@/lib/admin-context'
import { mergeProposalAction } from '@/app/actions/content'
import type { Proposal } from '@/lib/mock-data'

export function ProposalDetailActions({ proposal }: { proposal: Proposal }) {
  const { isAdmin } = useAdmin()

  if (!isAdmin) return null

  const disabled = proposal.status === 'merged' || proposal.status === 'closed'

  return (
    <form action={mergeProposalAction} className="flex items-center justify-end gap-2">
      <input type="hidden" name="proposalId" value={proposal.id} />
      <button
        type="submit"
        disabled={disabled}
        className={
          disabled
            ? 'inline-flex cursor-not-allowed items-center gap-1.5 rounded-md border border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground'
            : 'inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700'
        }
      >
        <Check className="size-4" />
        반영
      </button>
    </form>
  )
}
