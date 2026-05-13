'use client'

import { useEffect, useRef, useState } from 'react'
import { LogOut, ChevronDown } from 'lucide-react'
import { signOutAction } from '@/app/login/actions'

type Props = {
  name: string
  role: string
  initials: string
}

export function UserMenu({ name, role, initials }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
          <div className="font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-1 w-44 overflow-hidden rounded-md border border-border bg-background py-1 shadow-md"
        >
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
