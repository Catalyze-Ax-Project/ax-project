'use client'

import { BookOpen, FileCode2, GitCommit, GitPullRequestArrow, MessagesSquare, PencilLine, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DiscussionThread } from './DiscussionThread'
import { NewDiscussionForm } from './NewDiscussionForm'
import { ProposalItem } from './ProposalItem'
import { ChangeTimeline } from './ChangeTimeline'
import { formatRelative } from '@/lib/date-utils'
import { useAdmin } from '@/lib/admin-context'
import type { Change, Discussion, Plugin, Proposal } from '@/lib/mock-data'

type Props = {
  plugin: Plugin
  discussions: Discussion[]
  proposals: Proposal[]
  changes: Change[]
  memberTotal: number
}

export function PluginTabs({ plugin, discussions, proposals, changes, memberTotal }: Props) {
  const { isAdmin } = useAdmin()

  const handleEdit = () => {
    toast.info('편집 기능은 다음 단계에서 연결됩니다', {
      description: `${plugin.name} 내용 편집`,
    })
  }

  const openDiscussions = discussions.filter((d) => d.status === 'open')
  const openProposals = proposals.filter((p) => p.status === 'open' || p.status === 'in-review')
  const recentChanges = [...changes]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3)

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList
        variant="line"
        className="h-auto w-full justify-start gap-2 rounded-none border-b border-border p-0"
      >
        <TabTriggerIcon value="overview" icon={<BookOpen className="size-3.5" />}>
          Overview
        </TabTriggerIcon>
        <TabTriggerIcon value="content" icon={<FileCode2 className="size-3.5" />}>
          Content
        </TabTriggerIcon>
        <TabTriggerIcon value="discussions" icon={<MessagesSquare className="size-3.5" />}>
          Discussions
          <CountPill count={discussions.length} />
        </TabTriggerIcon>
        <TabTriggerIcon value="proposals" icon={<GitPullRequestArrow className="size-3.5" />}>
          Proposals
          <CountPill count={proposals.length} />
        </TabTriggerIcon>
        <TabTriggerIcon value="history" icon={<GitCommit className="size-3.5" />}>
          History
        </TabTriggerIcon>
      </TabsList>

      {/* Overview */}
      <TabsContent value="overview" keepMounted className="mt-5 space-y-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatTile
            icon={<Users className="size-4" />}
            label="사용자"
            value={`${plugin.adoptionCount}/${memberTotal}`}
            hint="이 플러그인을 사용하는 구성원 수"
          />
          <StatTile
            icon={<MessagesSquare className="size-4" />}
            label="진행 중 의견"
            value={openDiscussions.length}
            hint={`전체 ${discussions.length}개 중`}
          />
          <StatTile
            icon={<GitPullRequestArrow className="size-4" />}
            label="열린 제안"
            value={openProposals.length}
            hint={`전체 ${proposals.length}개 중`}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-border bg-background p-5">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <BookOpen className="size-3.5" />
              README
            </div>
            <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
              {plugin.contentPreview}
            </pre>
          </div>
          <div className="rounded-xl border border-border bg-background p-5">
            <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <GitCommit className="size-3.5" />
              최근 활동
            </div>
            {recentChanges.length === 0 ? (
              <p className="text-xs text-muted-foreground">아직 활동이 없습니다.</p>
            ) : (
              <ul className="space-y-3">
                {recentChanges.map((change) => (
                  <li key={change.id}>
                    <div className="text-sm text-foreground">{change.message}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {change.author} · {formatRelative(change.createdAt)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </TabsContent>

      {/* Content */}
      <TabsContent value="content" keepMounted className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">플러그인 내용</h3>
            <p className="text-xs text-muted-foreground">
              {plugin.name}.md 의 현재 내용입니다.
            </p>
          </div>
          {isAdmin ? (
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              <PencilLine className="size-3.5" />
              편집
            </button>
          ) : null}
        </div>
        <pre className="overflow-x-auto rounded-xl border border-border bg-muted/40 p-5 font-mono text-[13px] leading-relaxed text-foreground">
{plugin.contentPreview}
        </pre>
      </TabsContent>

      {/* Discussions */}
      <TabsContent value="discussions" keepMounted className="mt-5 space-y-3">
        <NewDiscussionForm pluginId={plugin.id} />
        {discussions.length === 0 ? (
          <EmptyHint label="아직 등록된 의견이 없습니다." />
        ) : (
          <ul className="space-y-3">
            {discussions.map((d) => {
              const linked = d.linkedProposalId
                ? proposals.find((p) => p.id === d.linkedProposalId)
                : undefined
              return (
                <li key={d.id}>
                  <DiscussionThread
                    discussion={d}
                    linkedProposal={linked}
                    isAdmin={isAdmin}
                  />
                </li>
              )
            })}
          </ul>
        )}
      </TabsContent>

      {/* Proposals */}
      <TabsContent value="proposals" keepMounted className="mt-5 space-y-3">
        {proposals.length === 0 ? (
          <EmptyHint label="이 플러그인에 등록된 변경 제안이 없습니다." />
        ) : (
          <ul className="space-y-3">
            {proposals.map((p) => (
              <li key={p.id}>
                <ProposalItem proposal={p} />
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      {/* History */}
      <TabsContent value="history" keepMounted className="mt-5">
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">변경 이력</h3>
            <p className="text-xs text-muted-foreground">최근 변경이 위쪽에 표시됩니다.</p>
          </div>
          <ChangeTimeline changes={changes} />
        </div>
      </TabsContent>
    </Tabs>
  )
}

function TabTriggerIcon({
  value,
  icon,
  children,
}: {
  value: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <TabsTrigger
      value={value}
      className="gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-3 py-2 text-sm text-muted-foreground hover:text-foreground data-active:border-primary data-active:bg-transparent data-active:text-foreground data-active:shadow-none"
    >
      {icon}
      {children}
    </TabsTrigger>
  )
}

function CountPill({ count }: { count: number }) {
  return (
    <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
      {count}
    </span>
  )
}

function StatTile({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  hint: string
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>
    </div>
  )
}

function EmptyHint({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-background p-8 text-center text-sm text-muted-foreground">
      {label}
    </div>
  )
}
