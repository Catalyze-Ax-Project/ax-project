'use client'

import { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { members, plugins } from '@/lib/mock-data'

const COLORS = ['#2563eb', '#06b6d4', '#14b8a6', '#f59e0b', '#ec4899', '#94a3b8']

export function AdoptionDonut() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const top = [...plugins].sort((a, b) => b.adoptionCount - a.adoptionCount).slice(0, 5)
  const data = top.map((p, i) => ({
    name: p.name,
    value: p.adoptionCount,
    color: COLORS[i],
  }))
  const denominator = members.length

  return (
    <section className="rounded-xl border border-border bg-background p-5">
      <div className="mb-2">
        <h3 className="text-sm font-semibold">Plugin Adoption</h3>
        <p className="text-xs text-muted-foreground">
          구성원 {denominator}명 기준 채택 상위 5개 플러그인
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-44 w-44 shrink-0">
          {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={78}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(v, _n, item) => {
                  const name = (item?.payload as { name: string } | undefined)?.name
                  return [`${v}/${denominator}`, name ?? '']
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          ) : null}
        </div>
        <ul className="flex-1 space-y-1.5">
          {data.map((d) => (
            <li key={d.name} className="flex items-center gap-2 text-xs">
              <span className="size-2 rounded-full" style={{ background: d.color }} />
              <span className="flex-1 truncate font-mono">{d.name}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {d.value}/{denominator}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
