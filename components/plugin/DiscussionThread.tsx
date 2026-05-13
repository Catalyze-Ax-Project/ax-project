'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { CheckCircle2, MessageCircle, MessagesSquare, Sparkles } from 'lucide-react'
import { formatRelative } from '@/lib/date-utils'
import {
  DISCUSSION_STATUS_LABEL,
  type Discussion,
  type Proposal,
} from '@/lib/mock-data'
import { convertDiscussionToProposalAction } from '@/app/actions/content'

type Props = {
  discussion: Discussion
  linkedProposal: Proposal | undefined
  isAdmin: boolean
}

export function DiscussionThread({ discussion, linkedProposal, isAdmin }: Props) {
  const [composing, setComposing] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

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

      {discussion.status === 'resolved' && linkedProposal ? (
        <Link
          href={`/proposals/${linkedProposal.id}`}
          className="mt-3 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900 transition-colors hover:bg-emerald-100"
        >
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
          <span className="min-w-0 flex-1">
            이 의견은 <b className="font-mono">{linkedProposal.id}</b> 로 반영되었습니다 — {linkedProposal.title}
          </span>
        </Link>
      ) : null}

      {discussion.status === 'open' && !composing ? (
        <div className="mt-3 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setComposing(true)}
            className={
              isAdmin
                ? 'inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90'
                : 'inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted'
            }
          >
            <Sparkles className="size-3.5" />이 의견을 반영한 제안 만들기
          </button>
        </div>
      ) : null}

      {composing ? (
        <form
          ref={formRef}
          action={async (fd) => {
            await convertDiscussionToProposalAction(fd)
            formRef.current?.reset()
            setComposing(false)
          }}
          className="mt-3 space-y-3 rounded-md border border-border bg-muted/30 p-3"
        >
          <input type="hidden" name="discussionId" value={discussion.id} />
          <div>
            <label className="block text-xs font-medium text-foreground">제안 제목</label>
            <input
              name="title"
              required
              autoFocus
              defaultValue={`${discussion.title} 반영`}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground">변경 설명 (선택)</label>
            <textarea
              name="description"
              rows={3}
              placeholder="어떤 식으로 반영할지 간단히 적어주세요."
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setComposing(false)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              취소
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="size-3.5" />
              제안 등록
            </button>
          </div>
        </form>
      ) : null}
    </div>
  )
}
