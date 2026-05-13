import { Briefcase, Megaphone, Rocket, Building2 } from 'lucide-react'
import { members, plugins, TEAM_LABEL, type Team } from '@/lib/mock-data'

type TeamInfo = {
  id: Team
  label: string
  description: string
  icon: React.ReactNode
  accent: string
}

const TEAMS: TeamInfo[] = [
  {
    id: 'bd',
    label: 'BD',
    description: '해외 클라이언트 발굴과 리드 협상을 담당합니다.',
    icon: <Briefcase className="size-5" />,
    accent: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: '콘텐츠 캘린더, 소셜 채널, 브랜드 톤 관리.',
    icon: <Megaphone className="size-5" />,
    accent: 'bg-pink-50 text-pink-700 border-pink-200',
  },
  {
    id: 'dev-growth',
    label: 'Dev Growth',
    description: '개발 생태계 확장, 기술 아티클, 개발자 대상 커뮤니케이션.',
    icon: <Rocket className="size-5" />,
    accent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'operations',
    label: 'Operations',
    description: '운영, 조직, 클라이언트 맥락 문서 관리.',
    icon: <Building2 className="size-5" />,
    accent: 'bg-amber-50 text-amber-700 border-amber-200',
  },
]

export default function TeamsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Teams</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {TEAMS.map((team) => {
          const teamMembers = members.filter((m) => m.team === team.id)
          const teamPlugins = plugins.filter((p) => p.team === team.id)
          return (
            <article
              key={team.id}
              className="rounded-xl border border-border bg-background p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`grid size-10 place-items-center rounded-lg border ${team.accent}`}>
                  {team.icon}
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">플러그인</div>
                  <div className="text-xl font-semibold tabular-nums">{teamPlugins.length}</div>
                </div>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{team.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{team.description}</p>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <div>
                  <div className="text-xs text-muted-foreground">멤버</div>
                  <div className="text-sm font-medium">{teamMembers.length}명</div>
                </div>
                <div className="flex -space-x-1.5">
                  {teamMembers.slice(0, 5).map((m) => (
                    <span
                      key={m.id}
                      title={m.name}
                      className="grid size-7 place-items-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold"
                    >
                      {m.avatarInitials}
                    </span>
                  ))}
                  {teamMembers.length > 5 ? (
                    <span className="grid size-7 place-items-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold text-muted-foreground">
                      +{teamMembers.length - 5}
                    </span>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="rounded-xl border border-dashed border-border bg-background p-4 text-xs text-muted-foreground">
        팀 구조 관리와 멤버 이동 기능은 다음 단계에서 연결됩니다. 현재는 조회 전용입니다.
      </div>
    </div>
  )
}
