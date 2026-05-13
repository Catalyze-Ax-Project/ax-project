'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  Copy,
  Plus,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import {
  KIND_LABEL,
  TEAM_LABEL,
  type Plugin,
  type PluginKind,
  type Team,
} from '@/lib/mock-data'

type Props = {
  plugins: Plugin[]
}

const KIND_ORDER: PluginKind[] = ['client', 'context', 'action']

// 마켓 좌측에 노출할 kind. agent는 미구현, common은 우리 데이터에 아직 없음.
const VISIBLE_KINDS = new Set<PluginKind>(['client', 'context', 'action'])

// Action 카테고리(=직무) 순서. 'common'은 전사 공통 액션이라 맨 앞.
const ACTION_TEAM_ORDER: Team[] = ['common', 'bd', 'dev-growth', 'marketing', 'operations']

export function CraftTable({ plugins }: Props) {
  const [query, setQuery] = useState('')
  // 조립은 client → context → action 순서. 디폴트는 client부터.
  const [activeKind, setActiveKind] = useState<PluginKind>('client')
  // Action 단계 진입 시에만 의미 있는 카테고리(직무) 필터. null이면 전체.
  const [activeActionTeam, setActiveActionTeam] = useState<Team | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const market = useMemo(() => plugins.filter((p) => VISIBLE_KINDS.has(p.kind)), [plugins])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return market.filter((p) => {
      if (p.kind !== activeKind) return false
      if (activeKind === 'action' && activeActionTeam && p.team !== activeActionTeam) {
        return false
      }
      if (!q) return true
      const hay = [p.name, p.description, ...(p.tags ?? [])]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [market, query, activeKind, activeActionTeam])

  // Action 카테고리별 카운트.
  const actionTeamCounts = useMemo(() => {
    const m = new Map<Team, number>()
    for (const p of market) {
      if (p.kind !== 'action') continue
      m.set(p.team, (m.get(p.team) ?? 0) + 1)
    }
    return m
  }, [market])

  const selected = useMemo(
    () =>
      selectedIds
        .map((id) => plugins.find((p) => p.id === id))
        .filter((p): p is Plugin => !!p),
    [selectedIds, plugins],
  )

  // 조립 결과: kind 순서대로 정렬 후 contentPreview를 연결.
  const composedPrompt = useMemo(() => {
    if (selected.length === 0) return ''
    const ordered = [...selected].sort(
      (a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind),
    )
    return ordered
      .map(
        (p) =>
          `<!-- ${KIND_LABEL[p.kind]}: ${p.name} -->\n\n${p.contentPreview.trim()}`,
      )
      .join('\n\n---\n\n')
  }, [selected])

  function toggle(id: string) {
    setSelectedIds((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id],
    )
  }

  function clearAll() {
    setSelectedIds([])
  }

  async function copy() {
    if (!composedPrompt) return
    try {
      await navigator.clipboard.writeText(composedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // ignore — older browsers fall back to manual selection
    }
  }

  const kindCounts = useMemo(() => {
    const m = new Map<PluginKind, number>()
    for (const p of market) m.set(p.kind, (m.get(p.kind) ?? 0) + 1)
    return m
  }, [market])

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* 좌측: 마켓 */}
      <section className="rounded-xl border border-border bg-background p-4">
        <header className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Plugin 마켓</h3>
          <span className="text-[11px] text-muted-foreground">
            {filtered.length}/{market.length}
          </span>
        </header>

        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름·설명·태그로 검색"
            className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="mb-2 flex flex-wrap gap-1.5">
          {KIND_ORDER.map((k) => (
            <KindChip
              key={k}
              label={KIND_LABEL[k]}
              count={kindCounts.get(k) ?? 0}
              active={activeKind === k}
              onClick={() => setActiveKind(k)}
            />
          ))}
        </div>

        {activeKind === 'action' ? (
          <div className="mb-3 flex flex-wrap items-center gap-1.5 border-l-2 border-primary/30 pl-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              카테고리
            </span>
            {ACTION_TEAM_ORDER.map((t) => {
              const count = actionTeamCounts.get(t) ?? 0
              if (count === 0) return null
              return (
                <TeamChip
                  key={t}
                  label={TEAM_LABEL[t]}
                  count={count}
                  active={activeActionTeam === t}
                  onClick={() =>
                    setActiveActionTeam(activeActionTeam === t ? null : t)
                  }
                />
              )
            })}
          </div>
        ) : null}

        <ul className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <li className="rounded-md border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              검색 결과 없음.
            </li>
          ) : (
            filtered.map((p) => {
              const picked = selectedIds.includes(p.id)
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => toggle(p.id)}
                    className={
                      picked
                        ? 'flex w-full items-start gap-2 rounded-md border border-primary/60 bg-primary/5 p-2.5 text-left'
                        : 'flex w-full items-start gap-2 rounded-md border border-border bg-background p-2.5 text-left transition-colors hover:border-primary/40 hover:bg-muted/30'
                    }
                  >
                    <span
                      className={
                        picked
                          ? 'mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground'
                          : 'mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground'
                      }
                    >
                      {picked ? <Check className="size-3" /> : <Plus className="size-3" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <span className="rounded bg-muted px-1.5 py-0.5 text-foreground/70">
                          {KIND_LABEL[p.kind]}
                        </span>
                      </div>
                      <div className="mt-1 truncate text-sm font-semibold">{p.name}</div>
                      {p.description ? (
                        <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                          {p.description}
                        </p>
                      ) : null}
                    </div>
                  </button>
                </li>
              )
            })
          )}
        </ul>
      </section>

      {/* 우측: 조립 */}
      <section className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-background p-4">
          <header className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h3 className="text-sm font-semibold">조립한 Skill</h3>
            </div>
            {selected.length > 0 ? (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
                비우기
              </button>
            ) : null}
          </header>

          {selected.length === 0 ? (
            <div className="rounded-md border border-dashed border-border bg-muted/20 p-6 text-center text-xs text-muted-foreground">
              왼쪽에서 plugin을 골라서 더해보세요.
              <br />
              Client + Context + Action 조합이면 가장 완전한 업무 대체 프롬프트가 됩니다.
            </div>
          ) : (
            <ol className="space-y-2">
              {[...selected]
                .sort(
                  (a, b) =>
                    KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind),
                )
                .map((p, i) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-2.5 py-1.5"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-background text-[10px] font-semibold tabular-nums text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
                      {KIND_LABEL[p.kind]}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm">{p.name}</span>
                    <button
                      type="button"
                      onClick={() => toggle(p.id)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="제거"
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
            </ol>
          )}
        </div>

        <div className="flex min-h-[200px] flex-col rounded-xl border border-border bg-background p-4">
          <header className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">합쳐진 프롬프트</h3>
            <button
              type="button"
              onClick={copy}
              disabled={!composedPrompt}
              className={
                composedPrompt
                  ? 'inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90'
                  : 'inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground'
              }
            >
              {copied ? (
                <>
                  <Check className="size-3.5" /> 복사됨
                </>
              ) : (
                <>
                  <Copy className="size-3.5" /> 복사
                </>
              )}
            </button>
          </header>
          {composedPrompt ? (
            <pre className="flex-1 overflow-auto whitespace-pre-wrap rounded-md bg-muted/30 p-3 font-mono text-[11px] leading-relaxed text-foreground">
              {composedPrompt}
            </pre>
          ) : (
            <div className="flex flex-1 items-center justify-center gap-2 text-xs text-muted-foreground">
              <ArrowRight className="size-3.5" />
              조립이 끝나면 여기 결과가 표시됩니다. 복사해서 본인 AI(ChatGPT / Claude)에 그대로 paste하세요.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function KindChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground'
          : 'inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-[11px] hover:bg-muted'
      }
    >
      {label}
      <span className="tabular-nums text-[10px] opacity-70">{count}</span>
    </button>
  )
}

function TeamChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground'
          : 'inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-foreground/80 hover:bg-muted/70'
      }
    >
      {label}
      <span className="tabular-nums text-[9px] opacity-70">{count}</span>
    </button>
  )
}
