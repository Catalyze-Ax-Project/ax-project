import Link from 'next/link'
import { ArrowRight, Clock, Sparkles, Plus, Copy } from 'lucide-react'
import { combos, currentUser, getPluginById, skillPlugins } from '@/lib/mock-data'
import { formatRelative } from '@/lib/date-utils'

export function QuickStart() {
  const recentCombo = combos[0]
  const recentClient = recentCombo ? getPluginById(recentCombo.clientId) : undefined
  const recentSkill = recentCombo ? getPluginById(recentCombo.skillId) : undefined

  const recommendedClient = getPluginById('client-ripple')
  const recommendedSkill =
    skillPlugins.find((p) => p.team === currentUser.team) ?? skillPlugins[0]

  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <h3 className="text-lg font-semibold">빠른 시작</h3>
        <p className="text-xs text-muted-foreground">
          {currentUser.name} · {currentUser.role}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recentCombo && recentClient && recentSkill ? (
          <QuickCard
            icon={<Clock className="size-4" />}
            tag="최근 쓴 조합"
            title={`${recentClient.name} × ${recentSkill.name}`}
            description={`마지막 사용 ${formatRelative(recentCombo.lastUsedAt)}`}
            action={
              <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                <Copy className="size-3.5" />
                다시 사용
              </button>
            }
          />
        ) : null}
        {recommendedClient && recommendedSkill ? (
          <QuickCard
            icon={<Sparkles className="size-4" />}
            tag={`${currentUser.role} 추천`}
            title={`${recommendedClient.name} × ${recommendedSkill.name}`}
            description="역할과 최근 활동 패턴을 바탕으로 추천된 조합입니다."
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
