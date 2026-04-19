import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, GitPullRequestArrow, MessageCircle, Link2 } from 'lucide-react'
import {
  PROPOSAL_STATUS_LABEL,
  discussions as allDiscussions,
  getPluginById,
  getPluginHref,
  proposals as allProposals,
  type ProposalStatus,
} from '@/lib/mock-data'
import { formatRelative } from '@/lib/date-utils'
import { ProposalDetailActions } from '@/components/proposal/ProposalDetailActions'

const STATUS_TONE: Record<ProposalStatus, string> = {
  open: 'bg-amber-100 text-amber-800',
  'in-review': 'bg-blue-100 text-blue-800',
  merged: 'bg-emerald-100 text-emerald-800',
  closed: 'bg-slate-200 text-slate-700',
}

const MOCK_DIFF = `--- a/{plugin}.md
+++ b/{plugin}.md
@@ -12,7 +12,11 @@
 ## 출력 규칙
 - 제목 후보 3개
-- 2,000자 내외 영문 초안
+- 2,000자 내외 영문 초안 (매체별 1인칭 규칙 반영)
+  - CoinDesk: 기자 1인칭 "I" 지양, 기관 화자 "we" 허용
+  - The Defiant: 1인칭 자유롭게 허용
+  - 매체명 미지정시: 3인칭 관찰자 시점 기본`

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const proposal = allProposals.find((p) => p.id === id)
  if (!proposal) notFound()

  const plugin = getPluginById(proposal.pluginId)
  const linkedDiscussion = proposal.linkedDiscussionId
    ? allDiscussions.find((d) => d.id === proposal.linkedDiscussionId)
    : undefined

  const diff = MOCK_DIFF.replace('{plugin}', plugin?.name ?? 'plugin')

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/proposals"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Proposals
      </Link>

      <header className="rounded-xl border border-border bg-background p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <GitPullRequestArrow className="size-3.5" />
              Proposal · <span className="font-mono">{proposal.id}</span>
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{proposal.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>
                대상 플러그인 ·{' '}
                <Link
                  href={getPluginHref(plugin)}
                  className="font-mono text-foreground hover:underline"
                >
                  {plugin?.name}
                </Link>
              </span>
              <span>·</span>
              <span>{proposal.author}</span>
              <span>·</span>
              <span>{formatRelative(proposal.createdAt)}</span>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-md px-3 py-1 text-xs font-medium ${STATUS_TONE[proposal.status]}`}
          >
            {PROPOSAL_STATUS_LABEL[proposal.status]}
          </span>
        </div>
      </header>

      {linkedDiscussion ? (
        <Link
          href={getPluginHref(linkedDiscussion.pluginId)}
          className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900 transition-colors hover:bg-blue-100"
        >
          <Link2 className="size-4 shrink-0 text-blue-600" />
          <span className="min-w-0 flex-1">
            이 제안은 의견{' '}
            <b className="font-mono">{linkedDiscussion.id}</b> — {linkedDiscussion.title} 에서 출발했습니다
          </span>
        </Link>
      ) : null}

      <section className="rounded-xl border border-border bg-background p-5">
        <h3 className="text-sm font-semibold">설명</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{proposal.description}</p>
      </section>

      <section className="rounded-xl border border-border bg-background p-5">
        <h3 className="text-sm font-semibold">변경 내용 (diff)</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Skeleton 단계에서는 미리보기 용도의 더미 diff가 표시됩니다.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-[12px] leading-relaxed">
{diff}
        </pre>
      </section>

      <section className="rounded-xl border border-border bg-background p-5">
        <div className="flex items-center gap-1.5 text-sm font-semibold">
          <MessageCircle className="size-4" />
          의견
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          이 제안에 대한 코멘트 스레드는 다음 단계에서 연결됩니다.
        </p>
      </section>

      <ProposalDetailActions proposal={proposal} />
    </div>
  )
}
