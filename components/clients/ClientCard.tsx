import Link from 'next/link'
import { ArrowRight, CalendarClock, Puzzle, User2, Users } from 'lucide-react'
import {
  getMemberById,
  getPluginById,
  type ClientMeta,
  type Plugin,
} from '@/lib/mock-data'
import { formatRelative } from '@/lib/date-utils'

type Props = {
  plugin: Plugin
  meta: ClientMeta
  memberTotal: number
  openProposals: number
}

export function ClientCard({ plugin, meta, memberTotal, openProposals }: Props) {
  const owner = getMemberById(meta.ownerId)
  const linkedSkills = meta.linkedSkillIds
    .map((id) => getPluginById(id))
    .filter((p): p is Plugin => !!p)

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="h-1 bg-primary/60" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">{meta.tagline}</div>
            <h3 className="mt-1 text-lg font-semibold">{plugin.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{plugin.description}</p>
          </div>
          <Link
            href={`/clients/${plugin.id}`}
            className="shrink-0 inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            세팅 보기
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Metric icon={<Puzzle className="size-3.5" />} label="Skills 연결" value={linkedSkills.length} />
          <Metric
            icon={<Users className="size-3.5" />}
            label="채택자"
            value={`${plugin.adoptionCount}/${memberTotal}`}
          />
          <Metric
            icon={<CalendarClock className="size-3.5" />}
            label="마지막 업데이트"
            value={formatRelative(plugin.updatedAt)}
            valueClass="mt-0.5 text-xs font-medium"
          />
        </div>

        {linkedSkills.length > 0 ? (
          <div className="mt-4">
            <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              연결된 Skills
            </div>
            <div className="flex flex-wrap gap-1">
              {linkedSkills.slice(0, 5).map((skill) => (
                <Link
                  key={skill.id}
                  href={`/skills/${skill.id}`}
                  className="rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono text-[11px] hover:bg-muted"
                >
                  {skill.name}
                </Link>
              ))}
              {linkedSkills.length > 5 ? (
                <span className="rounded-md px-2 py-0.5 text-[11px] text-muted-foreground">
                  +{linkedSkills.length - 5}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              <User2 className="size-3.5" />
              담당
            </div>
            <div className="flex items-center gap-2">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold">
                {owner?.avatarInitials ?? '—'}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{owner?.name ?? '미지정'}</div>
                <div className="truncate text-[11px] text-muted-foreground">{owner?.role}</div>
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            열린 제안 <b className="text-foreground">{openProposals}</b>
          </div>
        </div>
      </div>
    </article>
  )
}

function Metric({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  valueClass?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 px-3 py-2">
      <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className={valueClass ?? 'mt-0.5 text-lg font-semibold tabular-nums'}>{value}</div>
    </div>
  )
}
