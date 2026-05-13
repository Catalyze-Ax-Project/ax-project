import {
  Bot,
  GitCommit,
  GitPullRequestArrow,
  MessagesSquare,
  Puzzle,
  Sparkles,
} from 'lucide-react'
import {
  changes,
  discussions,
  members,
  plugins,
  proposals,
  skillPlugins,
} from '@/lib/mock-data'
import { isWithinWeek } from '@/lib/date-utils'
import { HeroDonut } from './HeroDonut'

const DONUT_COLORS = ['#ffffff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1']

export function HeroBanner() {
  // changes는 머지된 결과 그 자체. 이번 주 머지 수 == 이번 주 changes 수.
  const changesThisWeek = changes.filter((c) => isWithinWeek(c.createdAt)).length
  const mergedThisWeek = changesThisWeek

  const discussionsThisWeek = discussions.filter((d) => isWithinWeek(d.createdAt)).length
  const openProposals = proposals.filter(
    (p) => p.status === 'open' || p.status === 'in-review',
  ).length

  // 채택 도넛: changes 수 기준으로 즉석 계산 (plugin.adoptionCount는 모듈 로드 시점 고정값이라 변경 후 stale)
  const adoptionByPlugin = new Map<string, number>()
  for (const c of changes) {
    adoptionByPlugin.set(c.pluginId, (adoptionByPlugin.get(c.pluginId) ?? 0) + 1)
  }
  const top = [...plugins]
    .map((p) => ({ ...p, adoptionLive: adoptionByPlugin.get(p.id) ?? 0 }))
    .sort((a, b) => b.adoptionLive - a.adoptionLive)
    .slice(0, 5)
  const donutData = top.map((p, i) => ({
    name: p.name,
    value: p.adoptionLive,
    color: DONUT_COLORS[i],
  }))

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/95 via-primary to-primary/80 p-8 text-primary-foreground shadow-sm">
      <div className="absolute right-0 top-0 size-48 translate-x-12 -translate-y-12 rounded-full bg-white/10 blur-2xl" />

      <div className="relative grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              <Sparkles className="size-3.5" />
              This Week
            </div>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              이번 주{' '}
              <span className="rounded bg-white/20 px-2">{mergedThisWeek}번</span>의 변화로 각자의 노하우가
              <br />
               Catalyze의 공통 기준으로 쌓이고 있습니다.
            </h2>
            <p className="max-w-xl text-sm text-primary-foreground/85">
              한 사람의 AI 활용법이 모두의 기본값으로 쌓이는 과정 — 그것이 Catalyze의 성장 방식입니다.
            </p>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-3 sm:grid-cols-3">
            <HeroStat
              icon={<MessagesSquare className="size-3.5" />}
              label="Discussions"
              value={discussionsThisWeek}
            />
            <HeroStat
              icon={<GitPullRequestArrow className="size-3.5" />}
              label="Proposals"
              value={openProposals}
            />
            <HeroStat
              icon={<GitCommit className="size-3.5" />}
              label="Changes"
              value={changesThisWeek}
            />
            <HeroStat icon={<Puzzle className="size-3.5" />} label="Plugins" value={plugins.length} />
            <HeroStat
              icon={<Sparkles className="size-3.5" />}
              label="Skills"
              value={skillPlugins.length}
            />
            <HeroStat
              icon={<Bot className="size-3.5" />}
              label="Agents"
              value={0}
              note="Coming"
              muted
            />
          </div>
        </div>
        <div className="min-h-[320px] lg:col-span-1">
          <HeroDonut data={donutData} denominator={members.length} />
        </div>
      </div>
    </section>
  )
}

function HeroStat({
  icon,
  label,
  value,
  note,
  muted,
}: {
  icon: React.ReactNode
  label: string
  value: number
  note?: string
  muted?: boolean
}) {
  return (
    <div
      className={
        muted
          ? 'flex items-center justify-between gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 opacity-70 backdrop-blur'
          : 'flex items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 backdrop-blur'
      }
    >
      <div className="flex min-w-0 items-center gap-1.5 text-xs text-primary-foreground/80">
        {icon}
        <span className="truncate">{label}</span>
        {note ? (
          <span className="hidden shrink-0 text-[10px] text-primary-foreground/60 sm:inline">
            · {note}
          </span>
        ) : null}
      </div>
      <div className="shrink-0 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  )
}
