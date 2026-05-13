'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import {
  createMemberAction,
  type MemberCreateState,
} from '@/app/actions/members'
import { useAdmin } from '@/lib/admin-context'
import { TEAM_LABEL, type Team } from '@/lib/mock-data'

const TEAM_OPTIONS: Team[] = ['common', 'bd', 'marketing', 'dev-growth', 'operations']

export function AddMemberForm() {
  const { isAdmin } = useAdmin()
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  const [state, formAction, pending] = useActionState<
    MemberCreateState,
    FormData
  >(createMemberAction, { ok: false })

  // 성공 시 폼 비우고 접음.
  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset()
      setOpen(false)
    }
  }, [state.ok])

  // 펼쳐지면 첫 input 포커스.
  useEffect(() => {
    if (open) nameRef.current?.focus()
  }, [open])

  if (!isAdmin) return null

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="size-3.5" />
        멤버 추가
      </button>
    )
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-xl border border-border bg-background p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">새 멤버 추가</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="닫기"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="이름" htmlFor="member-name" required>
          <input
            ref={nameRef}
            id="member-name"
            name="name"
            type="text"
            required
            disabled={pending}
            placeholder="홍길동"
            className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-sm outline-none focus:border-primary disabled:opacity-60"
          />
        </Field>

        <Field label="팀" htmlFor="member-team" required>
          <select
            id="member-team"
            name="team"
            defaultValue="common"
            required
            disabled={pending}
            className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-sm outline-none focus:border-primary disabled:opacity-60"
          >
            {TEAM_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {TEAM_LABEL[t]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="역할" htmlFor="member-role" required>
          <input
            id="member-role"
            name="role"
            type="text"
            required
            disabled={pending}
            placeholder="예: BD Lead / Research Analyst"
            className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-sm outline-none focus:border-primary disabled:opacity-60"
          />
        </Field>

        <Field label="이니셜" htmlFor="member-initials" hint="비워두면 이름으로 자동 생성">
          <input
            id="member-initials"
            name="initials"
            type="text"
            maxLength={3}
            disabled={pending}
            placeholder="HG"
            className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-sm uppercase outline-none focus:border-primary disabled:opacity-60"
          />
        </Field>
      </div>

      {state.error ? (
        <p className="mt-3 text-xs text-destructive">{state.error}</p>
      ) : null}

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={pending}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-60"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {pending ? '추가 중…' : '추가'}
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1 flex items-baseline gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {label}
        {required ? <span className="text-destructive">*</span> : null}
        {hint ? (
          <span className="ml-auto text-[10px] font-normal normal-case tracking-normal text-muted-foreground/70">
            {hint}
          </span>
        ) : null}
      </label>
      {children}
    </div>
  )
}
