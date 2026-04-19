import { PluginCard } from '@/components/plugin/PluginCard'
import { plugins, TEAM_LABEL, type Team } from '@/lib/mock-data'

// 고객사(operations 팀의 client plugins)는 /clients 전용으로 분리되어 이 리스트에는 포함하지 않는다.
const TEAM_ORDER: Team[] = ['common', 'bd', 'marketing', 'dev-growth']

export default function PluginsPage() {
  const grouped: Record<Team, typeof plugins> = {
    common: [],
    bd: [],
    marketing: [],
    'dev-growth': [],
    operations: [],
  }
  for (const p of plugins) {
    if (p.kind === 'client') continue
    grouped[p.team].push(p)
  }
  const totalVisible = TEAM_ORDER.reduce((sum, t) => sum + grouped[t].length, 0)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Plugins</h2>
        <p className="text-sm text-muted-foreground">
          전 구성원이 사용하는 AI 프롬프트 모음입니다. 팀별로 그룹화되어 있습니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <SummaryChip label="전체" count={totalVisible} emphasized />
        {TEAM_ORDER.map((team) => (
          <SummaryChip key={team} label={TEAM_LABEL[team]} count={grouped[team].length} />
        ))}
      </div>

      <div className="space-y-8">
        {TEAM_ORDER.map((team) => {
          const items = grouped[team]
          if (items.length === 0) return null
          return (
            <section key={team}>
              <div className="mb-3 flex items-baseline gap-2">
                <h3 className="text-sm font-semibold">{TEAM_LABEL[team]}</h3>
                <span className="text-xs text-muted-foreground">· {items.length}개</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((plugin) => (
                  <PluginCard key={plugin.id} plugin={plugin} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function SummaryChip({
  label,
  count,
  emphasized,
}: {
  label: string
  count: number
  emphasized?: boolean
}) {
  return (
    <div
      className={
        emphasized
          ? 'inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground'
          : 'inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs'
      }
    >
      <span className={emphasized ? 'text-primary-foreground/90' : 'text-muted-foreground'}>
        {label}
      </span>
      <span className="tabular-nums font-semibold">{count}</span>
    </div>
  )
}
