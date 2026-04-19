import Link from 'next/link'
import {
  changes,
  currentUser,
  discussions,
  getMemberById,
  getMemberProjects,
  memberAssignments,
  proposals,
} from '@/lib/mock-data'
import { isWithinWeek } from '@/lib/date-utils'

export function MyToday() {
  const me = currentUser
  const meMember = getMemberById(me.id)
  const initials =
    meMember?.avatarInitials ??
    me.name
      .split(' ')
      .map((s) => s[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  const projects = getMemberProjects(me.id)
  const myProjectIds = memberAssignments[me.id] ?? []

  // 처리 대기
  const myOpenDiscussions = discussions.filter(
    (d) => d.author === me.name && d.status === 'open',
  )
  const myOpenProposals = proposals.filter(
    (p) => p.author === me.name && (p.status === 'open' || p.status === 'in-review'),
  )
  const newOnMyProjects = discussions.filter(
    (d) =>
      myProjectIds.includes(d.pluginId) &&
      d.status === 'open' &&
      d.author !== me.name,
  )

  // 이번 주 내 기여
  const myDiscussionsThisWeek = discussions.filter(
    (d) => d.author === me.name && isWithinWeek(d.createdAt),
  ).length
  const myProposalsThisWeek = proposals.filter(
    (p) => p.author === me.name && isWithinWeek(p.createdAt),
  ).length
  const myChangesThisWeek = changes.filter(
    (c) => c.author === me.name && isWithinWeek(c.createdAt),
  ).length

  return (
    <section className="rounded-xl border border-border bg-background p-5">
      <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{me.name}</span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                나
              </span>
            </div>
            <div className="text-xs text-muted-foreground">{me.role}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            담당 프로젝트
          </span>
          <div className="flex flex-wrap gap-1">
            {projects.length === 0 ? (
              <span className="text-xs text-muted-foreground">—</span>
            ) : (
              projects.map((p) =>
                p.href ? (
                  <Link
                    key={p.id}
                    href={p.href}
                    className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium hover:bg-muted"
                  >
                    {p.name}
                  </Link>
                ) : (
                  <span
                    key={p.id}
                    className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium"
                  >
                    {p.name}
                  </span>
                ),
              )
            )}
          </div>
        </div>
      </header>

      <div className="grid gap-6 pt-4 sm:grid-cols-2">
        <div>
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            처리 대기
          </h3>
          <ul className="space-y-2">
            <StatRow
              label="내가 연 의견"
              count={myOpenDiscussions.length}
              accent
            />
            <StatRow
              label="내 제안 검토 대기"
              count={myOpenProposals.length}
              accent
            />
            <StatRow
              label="담당 프로젝트의 새 의견"
              count={newOnMyProjects.length}
              accent
            />
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            이번 주 내 기여
          </h3>
          <ul className="space-y-2">
            <StatRow label="의견" count={myDiscussionsThisWeek} />
            <StatRow label="제안" count={myProposalsThisWeek} />
            <StatRow label="변경" count={myChangesThisWeek} />
          </ul>
        </div>
      </div>
    </section>
  )
}

function StatRow({
  label,
  count,
  accent,
}: {
  label: string
  count: number
  accent?: boolean
}) {
  const empty = count === 0
  return (
    <li className="flex items-center justify-between text-sm">
      <span className={empty ? 'text-muted-foreground' : 'text-foreground'}>{label}</span>
      <span
        className={
          empty
            ? 'rounded-md bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground'
            : accent
              ? 'rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary'
              : 'rounded-md bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums text-foreground'
        }
      >
        {count}
      </span>
    </li>
  )
}
