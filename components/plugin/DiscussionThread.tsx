'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { CheckCircle2, MessageCircle, MessagesSquare, Sparkles } from 'lucide-react'
import { formatRelative } from '@/lib/date-utils'
import {
  DISCUSSION_STATUS_LABEL,
  proposals,
  type Discussion,
} from '@/lib/mock-data'

type Props = {
  discussion: Discussion
  isAdmin: boolean
}

export function DiscussionThread({ discussion, isAdmin }: Props) {
  const linked = discussion.linkedProposalId
    ? proposals.find((p) => p.id === discussion.linkedProposalId)
    : undefined

  const handleConvertToProposal = () => {
    toast.success('새 제안 생성 플로우가 다음 단계에서 연결됩니다', {
      description: `의견 "${discussion.title}"을(를) 제안으로 변환`,
    })
  }

  const statusTone =
    discussion.status === 'resolved'
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-amber-100 text-amber-800'

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <MessagesSquare className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate text-sm font-medium text-foreground">{discussion.title}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{discussion.id}</span>
            <span>·</span>
            <span>{discussion.author}</span>
            <span>·</span>
            <span>{formatRelative(discussion.createdAt)}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="size-3" />
              {discussion.commentsCount}
            </span>
          </div>
        </div>
        <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-medium ${statusTone}`}>
          {DISCUSSION_STATUS_LABEL[discussion.status]}
        </span>
      </div>

      {discussion.status === 'resolved' && linked ? (
        <Link
          href={`/proposals/${linked.id}`}
          className="mt-3 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900 transition-colors hover:bg-emerald-100"
        >
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
          <span className="min-w-0 flex-1">
            이 의견은 <b className="font-mono">{linked.id}</b> 로 반영되었습니다 — {linked.title}
          </span>
        </Link>
      ) : null}

      {discussion.status === 'open' ? (
        <div className="mt-3 flex items-center justify-end">
          <button
            type="button"
            onClick={handleConvertToProposal}
            className={
              isAdmin
                ? 'inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90'
                : 'inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted'
            }
          >
            <Sparkles className="size-3.5" />이 의견을 반영한 PR 생성
          </button>
        </div>
      ) : null}
    </div>
  )
}
