'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bot,
  Briefcase,
  Building2,
  GitPullRequestArrow,
  LayoutDashboard,
  Puzzle,
  Sparkles,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/lib/sidebar-context'

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  comingSoon?: boolean
}

type NavSection = {
  title: string
  items: NavItem[]
}

const SECTIONS: NavSection[] = [
  {
    title: '활동',
    items: [
      { href: '/plugins', label: 'Plugins', icon: Puzzle },
      { href: '/proposals', label: 'Proposals', icon: GitPullRequestArrow },
    ],
  },
  {
    title: 'Harness',
    items: [
      { href: '/', label: 'Overview', icon: LayoutDashboard },
      { href: '/clients', label: 'Clients', icon: Briefcase },
      { href: '/skills', label: 'Skills', icon: Sparkles },
      { href: '/agents', label: 'Agents', icon: Bot, comingSoon: true },
    ],
  },
  {
    title: '조직',
    items: [
      { href: '/teams', label: 'Teams', icon: Building2 },
      { href: '/members', label: 'Members', icon: UserRound },
    ],
  },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export function Sidebar() {
  const pathname = usePathname()
  const { open, close } = useSidebar()

  useEffect(() => {
    close()
  }, [pathname, close])

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="사이드바 닫기"
          onClick={close}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo + mobile close */}
        <div className="flex items-center justify-between gap-2 border-b border-sidebar-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Catalyze"
              width={32}
              height={32}
              priority
              className="size-8 shrink-0"
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold">Catalyze</div>
              <div className="text-[11px] text-muted-foreground">AX Project</div>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="사이드바 닫기"
            className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </div>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(pathname, item.href)
                  const Icon = item.icon
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors',
                          active
                            ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.comingSoon ? (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Soon
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border px-5 py-3 text-[11px] text-muted-foreground">
          v0.1 · Skeleton
        </div>
      </aside>
    </>
  )
}
