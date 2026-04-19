'use client'

import Link from 'next/link'
import { ShieldCheck, AlertTriangle, Inbox } from 'lucide-react'
import { useAdmin } from '@/lib/admin-context'
import { discussions, proposals, getPluginById, getPluginHref } from '@/lib/mock-data'
import { REFERENCE_NOW, formatRelative } from '@/lib/date-utils'

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000

export function AdminWidgets() {
  const { isAdmin } = useAdmin()
  if (!isAdmin) return null

  const pending = proposals.filter((p) => p.status === 'open' || p.status === 'in-review')
  const top3 = [...pending].sort((a, b) => a.createdAt.localeCompare(b.createdAt)).slice(0, 3)

  const staleDiscussions = discussions.filter(
    (d) => d.status === 'open' && REFERENCE_NOW - new Date(d.createdAt).getTime() > SEVEN_DAYS,
  )

  return (
    <section className="rounded-xl border border-primary/20 bg-primary/5 p-5">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Admin 위젯</h3>
        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground">
          Admin
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Inbox className="size-4 text-primary" />
              리뷰 대기 제안
            </div>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {pending.length}건
            </span>
          </div>
          <ul className="space-y-2">
            {top3.map((p) => {
              const plugin = getPluginById(p.pluginId)
              return (
                <li key={p.id}>
                  <Link
                    href={`/proposals/${p.id}`}
                    className="group flex items-start justify-between gap-2 rounded-md p-2 -mx-2 hover:bg-muted/60"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-foreground group-hover:underline">
                        {p.title}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        <span className="font-mono">{plugin?.name}</span> · {p.author} · {formatRelative(p.createdAt)}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        p.status === 'open'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {p.status === 'open' ? '대기중' : '검토중'}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-background p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <AlertTriangle className="size-4 text-amber-500" />
              답변 없는 의견 (7일+)
            </div>
            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
              {staleDiscussions.length}건
            </span>
          </div>
          {staleDiscussions.length === 0 ? (
            <p className="text-xs text-muted-foreground">현재 7일 이상 답변이 없는 의견은 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {staleDiscussions.slice(0, 3).map((d) => {
                const plugin = getPluginById(d.pluginId)
                return (
                  <li key={d.id}>
                    <Link
                      href={getPluginHref(d.pluginId)}
                      className="group flex flex-col rounded-md p-2 -mx-2 hover:bg-muted/60"
                    >
                      <span className="truncate text-sm text-foreground group-hover:underline">
                        {d.title}
                      </span>
                      <span className="mt-0.5 text-xs text-muted-foreground">
                        <span className="font-mono">{plugin?.name}</span> · {d.author} · {formatRelative(d.createdAt)}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
