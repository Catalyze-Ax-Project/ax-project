'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  LogOut,
  ShieldCheck,
  ShieldOff,
  UserCog,
} from 'lucide-react'
import { signOutAction } from '@/app/login/actions'
import {
  disableAdminAction,
  enableAdminAction,
  type AdminEnableState,
} from '@/app/actions/admin'
import { useAdmin } from '@/lib/admin-context'

type Props = {
  name: string
  role: string
  initials: string
}

export function UserMenu({ name, role, initials }: Props) {
  const [open, setOpen] = useState(false)
  const [showPwInput, setShowPwInput] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pwInputRef = useRef<HTMLInputElement>(null)
  const { isAdmin } = useAdmin()

  const [enableState, enableFormAction, enablePending] = useActionState<
    AdminEnableState,
    FormData
  >(enableAdminAction, { ok: false })

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // 메뉴 닫히면 비번 입력 영역도 접음.
  useEffect(() => {
    if (!open) setShowPwInput(false)
  }, [open])

  // admin이 활성화 성공하면 입력 영역 접고 메뉴도 닫음.
  useEffect(() => {
    if (enableState.ok) {
      setShowPwInput(false)
      setOpen(false)
    }
  }, [enableState.ok])

  // 비번 입력 펼쳐지면 포커스.
  useEffect(() => {
    if (showPwInput) pwInputRef.current?.focus()
  }, [showPwInput])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="hidden items-center gap-2 rounded-md border border-transparent px-1 py-1 text-left transition-colors hover:bg-muted sm:flex"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="grid size-8 place-items-center rounded-full bg-muted text-xs font-semibold text-foreground">
          {initials}
        </div>
        <div className="text-sm leading-tight">
          <div className="font-medium">
            {name}
            {isAdmin ? (
              <span className="ml-1.5 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                Admin
              </span>
            ) : null}
          </div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-1 w-64 overflow-hidden rounded-md border border-border bg-background py-1 shadow-md"
        >
          <button
            type="button"
            role="menuitem"
            disabled
            title="기능 준비 중"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserCog className="size-3.5" />
            <span className="flex-1">회원정보 수정</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Soon</span>
          </button>

          {isAdmin ? (
            <form action={disableAdminAction}>
              <button
                type="submit"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
              >
                <ShieldOff className="size-3.5 text-muted-foreground" />
                <span className="flex-1">Admin 모드 해제</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  ON
                </span>
              </button>
            </form>
          ) : (
            <>
              <button
                type="button"
                role="menuitem"
                onClick={() => setShowPwInput((v) => !v)}
                aria-expanded={showPwInput}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
              >
                <ShieldCheck className="size-3.5 text-muted-foreground" />
                <span className="flex-1">Admin 모드</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  OFF
                </span>
              </button>

              {showPwInput ? (
                <form
                  action={enableFormAction}
                  className="flex flex-col gap-1.5 border-t border-border bg-muted/30 px-3 py-2"
                >
                  <label
                    htmlFor="admin-password"
                    className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Admin 비밀번호
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      ref={pwInputRef}
                      id="admin-password"
                      name="password"
                      type="password"
                      autoComplete="off"
                      disabled={enablePending}
                      className="h-7 flex-1 rounded border border-border bg-background px-2 text-xs outline-none focus:border-primary disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={enablePending}
                      className="h-7 rounded bg-primary px-2.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                    >
                      {enablePending ? '확인…' : '확인'}
                    </button>
                  </div>
                  {enableState.error ? (
                    <p className="text-[11px] text-destructive">{enableState.error}</p>
                  ) : null}
                </form>
              ) : null}
            </>
          )}

          <div className="my-1 border-t border-border" />

          <form action={signOutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
            >
              <LogOut className="size-3.5" />
              로그아웃
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}
