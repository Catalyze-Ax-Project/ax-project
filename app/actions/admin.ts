'use server'

import 'server-only'
import { revalidatePath } from 'next/cache'
import {
  clearAdminSession,
  getSessionMemberId,
  setAdminSession,
  verifyAdminPassword,
} from '@/lib/auth'

export type AdminEnableState = {
  ok: boolean
  error?: string
}

export async function enableAdminAction(
  _prev: AdminEnableState,
  formData: FormData,
): Promise<AdminEnableState> {
  const memberId = await getSessionMemberId()
  if (!memberId) return { ok: false, error: '로그인이 필요합니다.' }

  const input = String(formData.get('password') ?? '')
  if (!input) return { ok: false, error: '비밀번호를 입력하세요.' }

  if (!verifyAdminPassword(input)) {
    return { ok: false, error: '비밀번호가 일치하지 않습니다.' }
  }

  await setAdminSession()
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function disableAdminAction(): Promise<void> {
  await clearAdminSession()
  revalidatePath('/', 'layout')
}
