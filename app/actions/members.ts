'use server'

import 'server-only'
import { revalidatePath } from 'next/cache'
import { getSessionMemberId, isAdminSession } from '@/lib/auth'
import {
  clientPlugins,
  internalProjects,
  memberAssignments,
  members,
  type Member,
  type Team,
} from '@/lib/mock-data'

export type MemberCreateState = {
  ok: boolean
  error?: string
}

const VALID_TEAMS: Team[] = ['common', 'bd', 'marketing', 'dev-growth', 'operations']

function nextMemberId(name: string): string {
  // 영문 슬러그가 가능하면 사용, 아니면 인덱스.
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (slug) {
    let candidate = `u-${slug}`
    let i = 2
    while (members.some((m) => m.id === candidate)) {
      candidate = `u-${slug}-${i++}`
    }
    return candidate
  }
  let i = members.length + 1
  while (members.some((m) => m.id === `u-${i}`)) i++
  return `u-${i}`
}

function deriveInitials(name: string, override?: string): string {
  const raw = (override ?? '').trim()
  if (raw) return raw.slice(0, 3).toUpperCase()
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '??'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export type MemberUpdateState = {
  ok: boolean
  error?: string
}

export async function updateMemberAction(
  _prev: MemberUpdateState,
  formData: FormData,
): Promise<MemberUpdateState> {
  if (!(await isAdminSession())) {
    return { ok: false, error: 'Admin 권한이 필요합니다.' }
  }

  const id = String(formData.get('id') ?? '').trim()
  const name = String(formData.get('name') ?? '').trim()
  const teamRaw = String(formData.get('team') ?? '').trim()
  const role = String(formData.get('role') ?? '').trim()
  const initialsInput = String(formData.get('initials') ?? '').trim()

  if (!id) return { ok: false, error: '멤버 id가 없습니다.' }
  const member = members.find((m) => m.id === id)
  if (!member) return { ok: false, error: '해당 멤버를 찾지 못했습니다.' }

  if (!name) return { ok: false, error: '이름을 입력하세요.' }
  if (!role) return { ok: false, error: '역할을 입력하세요.' }
  if (!VALID_TEAMS.includes(teamRaw as Team)) {
    return { ok: false, error: '유효하지 않은 팀입니다.' }
  }

  member.name = name
  member.team = teamRaw as Team
  member.role = role
  member.avatarInitials = deriveInitials(name, initialsInput)

  // 담당 프로젝트 매핑 갱신. client + internalProject 모두 form에서 같이 받음.
  const projectIds = formData.getAll('projects').map((v) => String(v))
  const validIds = new Set([
    ...clientPlugins.map((c) => c.id),
    ...internalProjects.map((p) => p.id),
  ])
  memberAssignments[id] = projectIds.filter((x) => validIds.has(x))

  revalidatePath('/members')
  revalidatePath('/teams')
  revalidatePath('/')
  revalidatePath('/clients')
  return { ok: true }
}

export type MemberDeleteState = {
  ok: boolean
  error?: string
}

export async function deleteMemberAction(
  _prev: MemberDeleteState,
  formData: FormData,
): Promise<MemberDeleteState> {
  if (!(await isAdminSession())) {
    return { ok: false, error: 'Admin 권한이 필요합니다.' }
  }

  const id = String(formData.get('id') ?? '').trim()
  if (!id) return { ok: false, error: '멤버 id가 없습니다.' }

  const sessionId = await getSessionMemberId()
  if (sessionId === id) {
    return { ok: false, error: '본인 자신은 삭제할 수 없습니다.' }
  }

  const idx = members.findIndex((m) => m.id === id)
  if (idx < 0) return { ok: false, error: '해당 멤버를 찾지 못했습니다.' }

  // 멤버 entry + 담당 매핑 제거. discussion/proposal/change의 author 텍스트는
  // 이력으로 보존 (정책).
  members.splice(idx, 1)
  delete memberAssignments[id]

  revalidatePath('/members')
  revalidatePath('/teams')
  revalidatePath('/')
  revalidatePath('/clients')
  return { ok: true }
}

export async function createMemberAction(
  _prev: MemberCreateState,
  formData: FormData,
): Promise<MemberCreateState> {
  if (!(await isAdminSession())) {
    return { ok: false, error: 'Admin 권한이 필요합니다.' }
  }

  const name = String(formData.get('name') ?? '').trim()
  const teamRaw = String(formData.get('team') ?? '').trim()
  const role = String(formData.get('role') ?? '').trim()
  const initialsInput = String(formData.get('initials') ?? '').trim()

  if (!name) return { ok: false, error: '이름을 입력하세요.' }
  if (!role) return { ok: false, error: '역할을 입력하세요.' }
  if (!VALID_TEAMS.includes(teamRaw as Team)) {
    return { ok: false, error: '유효하지 않은 팀입니다.' }
  }

  const member: Member = {
    id: nextMemberId(name),
    name,
    team: teamRaw as Team,
    role,
    weeklyUsage: 0,
    avatarInitials: deriveInitials(name, initialsInput),
  }
  members.push(member)

  revalidatePath('/members')
  revalidatePath('/teams')
  revalidatePath('/')
  return { ok: true }
}
