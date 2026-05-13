'use client'

import { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

type Slice = { name: string; value: number; color: string }

type Props = {
  data: Slice[]
  denominator: number
}

export function HeroDonut({ data, denominator }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur">
      <div className="mb-3 text-sm font-semibold">Plugin Adoption</div>

      <div className="relative min-h-[160px] flex-1">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="88%"
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 8,
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                }}
                formatter={(v, _n, item) => {
                  const name = (item?.payload as { name: string } | undefined)?.name
                  return [`${v}/${denominator}`, name ?? '']
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : null}
      </div>

      <ul className="mt-4 space-y-1 text-[11px]">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-1.5">
            <span className="size-2 shrink-0 rounded-full" style={{ background: d.color }} />
            <span className="flex-1 truncate font-mono text-primary-foreground/90">{d.name}</span>
            <span className="shrink-0 tabular-nums text-primary-foreground/70">
              {d.value}/{denominator}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
