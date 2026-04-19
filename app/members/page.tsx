import Link from 'next/link'
import {
  currentUser,
  getMemberProjects,
  members,
  TEAM_LABEL,
} from '@/lib/mock-data'

export default function MembersPage() {
  const rows = members.map((m) => ({
    ...m,
    projects: getMemberProjects(m.id),
  }))

  // 담당 많은 순 → 이름 순
  rows.sort((a, b) => {
    if (b.projects.length !== a.projects.length) return b.projects.length - a.projects.length
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Members</h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">이름</th>
              <th className="px-4 py-3 text-left font-medium">팀</th>
              <th className="px-4 py-3 text-left font-medium">역할</th>
              <th className="px-4 py-3 text-left font-medium">담당 프로젝트</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
              const isCurrent = m.id === currentUser.id
              return (
                <tr
                  key={m.id}
                  className={
                    isCurrent
                      ? 'border-t border-border bg-primary/5'
                      : 'border-t border-border hover:bg-muted/40'
                  }
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          isCurrent
                            ? 'grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground'
                            : 'grid size-8 place-items-center rounded-full bg-muted text-xs font-semibold text-foreground'
                        }
                      >
                        {m.avatarInitials}
                      </span>
                      <span className="font-medium">
                        {m.name}
                        {isCurrent ? (
                          <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                            나
                          </span>
                        ) : null}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{TEAM_LABEL[m.team]}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{m.role}</td>
                  <td className="px-4 py-3">
                    {m.projects.length === 0 ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {m.projects.map((project) =>
                          project.href ? (
                            <Link
                              key={project.id}
                              href={project.href}
                              className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium hover:bg-muted"
                            >
                              {project.name}
                            </Link>
                          ) : (
                            <span
                              key={project.id}
                              className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium"
                            >
                              {project.name}
                            </span>
                          ),
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
