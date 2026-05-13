import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, GitPullRequestArrow, Link2, Minus, Plus } from 'lucide-react'
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

// 데모용 더미. 모든 proposal에 같은 mock이 보인다. 추후 Proposal 타입에
// added/removed/diff 필드를 두고 데이터 기반으로 풀 예정.
const MOCK_ADDED = [
  '발화자별 어투(존댓말/반말/이모지 등)를 요약 결과에 보존하는 규칙',
  '출력 템플릿에 "원문 인용 톤 유지" 항목 추가',
  '분석 단계에서 발화자별 어휘 빈도를 함께 추적',
]
const MOCK_REMOVED: string[] = []

const MOCK_DIFF_LINES: { kind: 'context' | 'add' | 'remove'; text: string }[] = [
  { kind: 'context', text: '## 모드 B-3. 분석 수행' },
  { kind: 'context', text: '' },
  { kind: 'context', text: '다음 4단계를 항상 수행하고, 결과를 아래 출력 템플릿에 채웁니다.' },
  { kind: 'context', text: '' },
  { kind: 'context', text: '1. **의사결정자 발언 흐름**: HQ 인물 맵의 발언만 시간순 정리' },
  { kind: 'context', text: '2. **Action Item 추출**: "TODO", "@누구", "by {date}" 패턴 + 명령형 문장 자동 인식' },
  { kind: 'context', text: '3. **영향 분석**: BD / Marketing / DevRel / Operations 4개 축으로 분류' },
  { kind: 'remove', text: '4. **블로커 표시**: 미해결·대기·승인필요 항목을 별도로 강조' },
  { kind: 'add', text: '4. **발화자별 톤 보존**: 존댓말/반말/이모지 사용 패턴을 발화자 단위로 추적해 요약 결과에 그대로 반영' },
  { kind: 'add', text: '5. **블로커 표시**: 미해결·대기·승인필요 항목을 별도로 강조' },
  { kind: 'context', text: '' },
  { kind: 'context', text: '### 출력 템플릿' },
  { kind: 'context', text: '' },
  { kind: 'context', text: '```markdown' },
  { kind: 'context', text: '# {YYYY-MM-DD} {client} Slack Brief' },
  { kind: 'context', text: '' },
  { kind: 'context', text: '## TL;DR (3줄)' },
  { kind: 'context', text: '- ...' },
  { kind: 'context', text: '' },
  { kind: 'context', text: '## 핵심 의사결정' },
  { kind: 'remove', text: '- **{인물}** ({날짜}): {요약}' },
  { kind: 'add', text: '- **{인물}** ({날짜}, 어투: {존댓말/반말/이모지 톤}): {요약}' },
]

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
              제안
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{proposal.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>
                대상 플러그인 ·{' '}
                <Link
                  href={getPluginHref(plugin)}
                  className="text-foreground hover:underline"
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
            이 제안의 출처: <b>{linkedDiscussion.title}</b>
          </span>
        </Link>
      ) : null}

      <section className="rounded-xl border border-border bg-background p-5">
        <h3 className="text-sm font-semibold">설명</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{proposal.description}</p>
      </section>

      <section className="rounded-xl border border-border bg-background p-5">
        <h3 className="text-sm font-semibold">반영 시 변경되는 내용</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          이 제안이 반영되면 플러그인 본문에 다음 내용이 적용됩니다.
        </p>

        <div className="mt-4 space-y-3">
          {MOCK_ADDED.length > 0 ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <Plus className="size-3.5" />
                추가되는 내용
              </div>
              <ul className="ml-1 list-disc space-y-1 pl-4 text-sm text-emerald-900">
                {MOCK_ADDED.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {MOCK_REMOVED.length > 0 ? (
            <div className="rounded-md border border-rose-200 bg-rose-50 p-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-rose-800">
                <Minus className="size-3.5" />
                제거되는 내용
              </div>
              <ul className="ml-1 list-disc space-y-1 pl-4 text-sm text-rose-900">
                {MOCK_REMOVED.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-background p-5">
        <h3 className="text-sm font-semibold">실제 코드 수정 내용</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          플러그인 md 파일에 적용되는 diff입니다. 초록색은 추가, 빨간색은 제거.
        </p>
        <div className="mt-3 overflow-x-auto rounded-md border border-border bg-background font-mono text-[12px] leading-relaxed">
          {MOCK_DIFF_LINES.map((line, i) => {
            const isAdd = line.kind === 'add'
            const isRemove = line.kind === 'remove'
            const rowClass = isAdd
              ? 'bg-emerald-50 text-emerald-900'
              : isRemove
                ? 'bg-rose-50 text-rose-900'
                : 'text-foreground'
            const sign = isAdd ? '+' : isRemove ? '−' : ' '
            const signClass = isAdd
              ? 'text-emerald-700'
              : isRemove
                ? 'text-rose-700'
                : 'text-muted-foreground/50'
            return (
              <div key={i} className={`flex ${rowClass}`}>
                <span
                  className={`w-7 shrink-0 select-none border-r border-border bg-muted/40 px-2 text-center ${signClass}`}
                >
                  {sign}
                </span>
                <span className="whitespace-pre px-3 py-0.5">
                  {line.text === '' ? ' ' : line.text}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <ProposalDetailActions proposal={proposal} />
    </div>
  )
}
