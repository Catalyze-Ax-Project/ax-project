import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getSessionMemberId } from '@/lib/auth'
import { signInAction } from './actions'

type SearchParams = Promise<{ error?: string; email?: string }>

export const metadata = {
  title: 'Catalyze AX Project — 로그인',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const existing = await getSessionMemberId()
  if (existing) redirect('/')

  const { error, email } = await searchParams
  const errorMessage =
    error === 'invalid' ? '이메일 또는 비밀번호가 올바르지 않습니다.' : null

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Image src="/logo.png" alt="Catalyze" width={36} height={36} priority className="size-9" />
          <div>
            <div className="text-sm font-semibold leading-tight">Catalyze</div>
            <div className="text-xs text-muted-foreground">AX Project</div>
          </div>
        </div>

        <h1 className="text-lg font-semibold tracking-tight">로그인</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          파일럿 구성원 계정으로 입장하세요.
        </p>

        <form action={signInAction} className="mt-5 space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-medium text-foreground">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue={email ?? ''}
              placeholder="jun@catalyze-research.com"
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-medium text-foreground">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {errorMessage ? (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            로그인
          </button>
        </form>

        <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
          파일럿 5명만 접근할 수 있습니다. 비밀번호는 공통이며 운영팀에서 안내합니다.
        </p>
      </div>
    </div>
  )
}
