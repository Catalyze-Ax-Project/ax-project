'use client'

import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { AdminToggle } from './AdminToggle'
import { currentUser } from '@/lib/mock-data'
import { useSidebar } from '@/lib/sidebar-context'

const TITLES: Record<string, string> = {
  '/': 'Overview',
  '/plugins': 'Plugins',
  '/proposals': 'Proposals',
  '/clients': 'Clients',
  '/skills': 'Skills',
  '/agents': 'Agents',
  '/teams': 'Teams',
  '/members': 'Members',
}

function resolveTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname]
  const prefix = '/' + pathname.split('/').filter(Boolean)[0]
  return TITLES[prefix] ?? 'Harness'
}

export function Header() {
  const pathname = usePathname()
  const { toggle } = useSidebar()
  const title = resolveTitle(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          aria-label="사이드바 열기"
          onClick={toggle}
          className="grid size-9 shrink-0 place-items-center rounded-md border border-border text-foreground hover:bg-muted lg:hidden"
        >
          <Menu className="size-4" />
        </button>
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Harness</div>
          <h1 className="truncate text-sm font-semibold leading-tight">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <AdminToggle />
        <div className="hidden items-center gap-2 border-l border-border pl-3 sm:flex">
          <div className="grid size-8 place-items-center rounded-full bg-muted text-xs font-semibold text-foreground">
            {currentUser.name
              .split(' ')
              .map((s) => s[0])
              .join('')}
          </div>
          <div className="text-sm leading-tight">
            <div className="font-medium">{currentUser.name}</div>
            <div className="text-xs text-muted-foreground">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
