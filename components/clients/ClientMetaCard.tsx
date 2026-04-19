import Link from 'next/link'
import { CalendarClock, User2 } from 'lucide-react'
import {
  getMemberById,
  getPluginById,
  type ClientMeta,
  type Plugin,
} from '@/lib/mock-data'
import { formatRelative } from '@/lib/date-utils'

export function ClientMetaCard({ meta }: { meta: ClientMeta }) {
  const owner = getMemberById(meta.ownerId)
  const linkedSkills = meta.linkedSkillIds
    .map((id) => getPluginById(id))
    .filter((p): p is Plugin => !!p)

  return (
    <section className="rounded-xl border border-border bg-background p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Client Setup
        </span>
        <span className="text-xs text-muted-foreground">· {meta.tagline}</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <InfoBlock
          icon={<User2 className="size-3.5" />}
          label="담당자"
          primary={owner?.name ?? '미지정'}
          secondary={owner?.role}
          initials={owner?.avatarInitials}
        />
        <InfoBlock
          icon={<CalendarClock className="size-3.5" />}
          label="온보딩"
          primary={formatRelative(meta.onboardedAt)}
          secondary={`${meta.linkedSkillIds.length}개 Skill 연결`}
        />
      </div>

      {linkedSkills.length > 0 ? (
        <div className="mt-5 border-t border-border pt-4">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            연결된 Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {linkedSkills.map((skill) => (
              <Link
                key={skill.id}
                href={`/skills/${skill.id}`}
                className="rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-xs hover:bg-muted"
              >
                {skill.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function InfoBlock({
  icon,
  label,
  primary,
  secondary,
  initials,
}: {
  icon: React.ReactNode
  label: string
  primary: string
  secondary?: string
  initials?: string
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="flex items-center gap-2">
        {initials ? (
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">
            {initials}
          </span>
        ) : null}
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{primary}</div>
          {secondary ? (
            <div className="truncate text-xs text-muted-foreground">{secondary}</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
