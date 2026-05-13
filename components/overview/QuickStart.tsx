import Link from 'next/link'
import { ArrowRight, Sparkles, Plus, Copy } from 'lucide-react'
import {
  clientPlugins,
  getPluginById,
  memberAssignments,
  skillPlugins,
} from '@/lib/mock-data'
import { getCurrentMember } from '@/lib/auth'

export async function QuickStart() {
  const me = await getCurrentMember()
  if (!me) return null

  // 추천 client: 본인 담당 client 중 첫 번째. 없으면 전체 client 중 첫 번째.
  const myClientIds = (memberAssignments[me.id] ?? []).filter((id) =>
    clientPlugins.some((c) => c.id === id),
  )
  const recommendedClient =
    (myClientIds[0] ? getPluginById(myClientIds[0]) : undefined) ?? clientPlugins[0]

  // 추천 skill: team이 일치하는 것 우선, 없으면 first.
  const recommendedSkill =
    skillPlugins.find((p) => p.team === me.team) ?? skillPlugins[0]

  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <h3 className="text-lg font-semibold">빠른 시작</h3>
        <p className="text-xs text-muted-foreground">
          {me.name} · {me.role}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recommendedClient && recommendedSkill ? (
          <QuickCard
            icon={<Sparkles className="size-4" />}
            tag={`${me.role} 추천`}
            title={`${recommendedClient.name} × ${recommendedSkill.name}`}
            description={
              myClientIds.length > 0
                ? '담당 클라이언트와 팀 기본 스킬을 조합한 추천입니다.'
                : '팀 기본 스킬과 첫 클라이언트의 조합입니다.'
            }
            action={
              <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
                <Copy className="size-3.5" />
                조합 복사
              </button>
            }
          />
        ) : null}
        <Link
          href="/skills"
          className="flex flex-col items-start justify-between rounded-xl border border-dashed border-border bg-background/60 p-5 transition-colors hover:border-primary/50 hover:bg-primary/5"
        >
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Plus className="size-4" />
            새 조합 만들기
          </div>
          <div className="mt-3 space-y-1">
            <div className="text-sm font-semibold">Clients × Skills 직접 고르기</div>
            <p className="text-xs text-muted-foreground">
              클라이언트와 스킬을 조합해서 본인 AI 에이전트에 붙여넣을 프롬프트를 만드세요.
            </p>
          </div>
          <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
            Skills 열기
            <ArrowRight className="size-3.5" />
          </div>
        </Link>
      </div>
    </section>
  )
}

function QuickCard({
  icon,
  tag,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  tag: string
  title: string
  description: string
  action: React.ReactNode
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-background p-5">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {icon}
          {tag}
        </div>
        <div className="mt-3 font-mono text-sm font-semibold">{title}</div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="mt-4">{action}</div>
    </div>
  )
}
