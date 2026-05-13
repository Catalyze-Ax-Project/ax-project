import 'server-only'
import { cookies } from 'next/headers'
import { getMemberById, type Member } from './mock-data'

export const SESSION_COOKIE = 'ax_session'
export const ADMIN_COOKIE = 'ax_admin'

const PASSWORD = 'catalyze1234@'

type Account = {
  email: string
  password: string
  memberId: string
}

export const accounts: Account[] = [
  { email: 'jay.lee@catalyze-research.com', password: PASSWORD, memberId: 'u-jay' },
  { email: 'harry@catalyze-research.com', password: PASSWORD, memberId: 'u-harry' },
  { email: 'jay.park@catalyze-research.com', password: PASSWORD, memberId: 'u-jayp' },
  { email: 'jake.ku@catalyze-research.com', password: PASSWORD, memberId: 'u-jake' },
  { email: 'jun@catalyze-research.com', password: PASSWORD, memberId: 'u-jun' },
]

export function verifyCredentials(email: string, password: string): string | null {
  const normalized = email.trim().toLowerCase()
  const account = accounts.find(
    (a) => a.email === normalized && a.password === password,
  )
  return account?.memberId ?? null
}

export async function getSessionMemberId(): Promise<string | null> {
  const store = await cookies()
  return store.get(SESSION_COOKIE)?.value ?? null
}

export async function getCurrentMember(): Promise<Member | null> {
  const id = await getSessionMemberId()
  if (!id) return null
  return getMemberById(id) ?? null
}

export async function setSession(memberId: string): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE, memberId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearSession(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

// ---- Admin mode ---------------------------------------------------------
// Admin 모드는 별도 비밀번호로 활성화한다.
// 값은 환경변수 ADMIN_PASSWORD에서 읽으며, 설정 안 돼 있으면 항상 실패한다.
// 활성화 시 httpOnly 쿠키 ax_admin=1 (7일).

export function verifyAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    console.warn('[auth] ADMIN_PASSWORD env not set — admin mode is disabled.')
    return false
  }
  return input === expected
}

export async function isAdminSession(): Promise<boolean> {
  const store = await cookies()
  return store.get(ADMIN_COOKIE)?.value === '1'
}

export async function setAdminSession(): Promise<void> {
  const store = await cookies()
  store.set(ADMIN_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
}
