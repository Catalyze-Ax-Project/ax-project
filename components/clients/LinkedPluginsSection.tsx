import { Link2 } from 'lucide-react'
import { PluginCard } from '@/components/plugin/PluginCard'
import { KIND_LABEL, type Plugin, type PluginKind } from '@/lib/mock-data'

type Props = {
  plugins: Plugin[]
}

const ORDER: PluginKind[] = ['context', 'action', 'common', 'agent']

export function LinkedPluginsSection({ plugins }: Props) {
  if (plugins.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-border bg-background p-5">
        <header className="mb-2 flex items-center gap-2">
          <Link2 className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">연결된 Plugins</h3>
        </header>
        <p className="text-xs text-muted-foreground">
          아직 이 클라이언트와 연결된 Context·Action plugin이 없습니다. 새 plugin의
          frontmatter에 <code className="rounded bg-muted px-1 text-[11px]">linked_clients</code> 항목을 추가하세요.
        </p>
      </section>
    )
  }

  const grouped: Record<PluginKind, Plugin[]> = {
    client: [],
    context: [],
    action: [],
    common: [],
    agent: [],
  }
  for (const p of plugins) grouped[p.kind].push(p)

  return (
    <section className="rounded-xl border border-border bg-background p-5">
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link2 className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">연결된 Plugins</h3>
        </div>
        <span className="text-[11px] text-muted-foreground">
          이 클라이언트 업무 맥락에 귀속되는 부품들
        </span>
      </header>

      <div className="space-y-5">
        {ORDER.map((kind) => {
          const items = grouped[kind]
          if (items.length === 0) return null
          return (
            <div key={kind}>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {KIND_LABEL[kind]}
                </span>
                <span className="text-[11px] text-muted-foreground">· {items.length}개</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <PluginCard key={p.id} plugin={p} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
