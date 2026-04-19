'use client'

import { useMemo, useState } from 'react'
import { PluginCard } from '@/components/plugin/PluginCard'
import { skillPlugins } from '@/lib/mock-data'

type Props = {
  allTags: string[]
}

export function SkillsList({ allTags }: Props) {
  const [active, setActive] = useState<string | null>(null)

  const filtered = useMemo(
    () =>
      active
        ? skillPlugins.filter((p) => p.tags?.includes(active))
        : skillPlugins,
    [active],
  )

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <TagChip label="전체" active={active === null} onClick={() => setActive(null)} count={skillPlugins.length} />
        {allTags.map((tag) => {
          const count = skillPlugins.filter((p) => p.tags?.includes(tag)).length
          if (count === 0) return null
          return (
            <TagChip
              key={tag}
              label={tag}
              active={active === tag}
              count={count}
              onClick={() => setActive(active === tag ? null : tag)}
            />
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background p-10 text-center text-sm text-muted-foreground">
          이 태그에 해당하는 Skill이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((plugin) => (
            <PluginCard key={plugin.id} plugin={plugin} href={`/skills/${plugin.id}`} />
          ))}
        </div>
      )}
    </>
  )
}

function TagChip({
  label,
  active,
  count,
  onClick,
}: {
  label: string
  active: boolean
  count: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground'
          : 'inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-muted'
      }
    >
      {label}
      <span className={active ? 'tabular-nums font-semibold' : 'tabular-nums text-muted-foreground'}>
        {count}
      </span>
    </button>
  )
}
