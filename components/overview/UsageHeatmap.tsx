'use client'

import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { members, currentUser } from '@/lib/mock-data'

const ACCENT = '#2563eb'
const BASE = '#cbd5e1'

export function UsageHeatmap() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const sorted = [...members].sort((a, b) => b.weeklyUsage - a.weeklyUsage)
  const data = sorted.map((m) => ({
    name: m.name.split(' ')[0],
    full: m.name,
    usage: m.weeklyUsage,
    isCurrent: m.id === currentUser.id,
  }))
  const total = members.reduce((s, m) => s + m.weeklyUsage, 0)
  const avg = Math.round((total / members.length) * 10) / 10
  const min = Math.min(...members.map((m) => m.weeklyUsage))
  const max = Math.max(...members.map((m) => m.weeklyUsage))

  return (
    <section className="rounded-xl border border-border bg-background p-5">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h3 className="text-sm font-semibold">전사 활용 현황</h3>
          <p className="text-xs text-muted-foreground">
            이번 주 구성원별 플러그인 조합 복사 횟수 분포
          </p>
        </div>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span>평균 <b className="text-foreground">{avg}</b></span>
          <span>최소 <b className="text-foreground">{min}</b></span>
          <span>최대 <b className="text-foreground">{max}</b></span>
        </div>
      </div>
      <div className="h-56 w-full">
        {mounted ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 32 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#64748b' }}
              angle={-25}
              textAnchor="end"
              interval={0}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              cursor={{ fill: 'rgba(100,116,139,0.08)' }}
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
              formatter={(v) => [`${v} 회`, '이번 주 사용']}
              labelFormatter={(_, payload) => (payload?.[0]?.payload as { full: string } | undefined)?.full ?? ''}
            />
            <Bar dataKey="usage" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.isCurrent ? ACCENT : BASE} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        ) : null}
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm" style={{ background: ACCENT }} />
          <span className="text-muted-foreground">내 위치 ({currentUser.name})</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm" style={{ background: BASE }} />
          <span className="text-muted-foreground">다른 구성원</span>
        </span>
      </div>
    </section>
  )
}
