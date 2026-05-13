'use server'

import { redirect } from 'next/navigation'
import { clearSession, setSession, verifyCredentials } from '@/lib/auth'

export async function signInAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const memberId = verifyCredentials(email, password)

  if (!memberId) {
    const params = new URLSearchParams({
      error: 'invalid',
      email: email.trim().toLowerCase(),
    })
    redirect(`/login?${params.toString()}`)
  }

  await setSession(memberId)
  redirect('/')
}

export async function signOutAction(): Promise<void> {
  await clearSession()
  redirect('/login')
}
