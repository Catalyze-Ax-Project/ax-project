import 'server-only'
import { cookies } from 'next/headers'
import { getMemberById, type Member } from './mock-data'

export const SESSION_COOKIE = 'ax_session'

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
