import {
  clientPlugins,
  getMemberProjects,
  internalProjects,
  memberAssignments,
  members,
} from '@/lib/mock-data'
import { getCurrentMember } from '@/lib/auth'
import { AddMemberForm } from '@/components/members/AddMemberForm'
import {
  MembersTable,
  type ProjectOption,
} from '@/components/members/MembersTable'

export default async function MembersPage() {
  const me = await getCurrentMember()
  const rows = members.map((m) => ({
    ...m,
    projects: getMemberProjects(m.id),
    projectIds: memberAssignments[m.id] ?? [],
  }))

  // 담당 많은 순 → 이름 순
  rows.sort((a, b) => {
    if (b.projects.length !== a.projects.length) return b.projects.length - a.projects.length
    return a.name.localeCompare(b.name)
  })

  const projectOptions: ProjectOption[] = [
    ...clientPlugins.map((c) => ({ id: c.id, name: c.name, kind: 'client' as const })),
    ...internalProjects.map((p) => ({ id: p.id, name: p.name, kind: 'internal' as const })),
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Members</h2>
      </div>

      <AddMemberForm />

      <MembersTable
        rows={rows}
        currentMemberId={me?.id ?? null}
        projectOptions={projectOptions}
      />
    </div>
  )
}
