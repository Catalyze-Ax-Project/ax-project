'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'

export type ProjectOption = {
  id: string
  name: string
  kind: 'client' | 'internal'
}

type Props = {
  options: ProjectOption[]
  defaultSelected: string[]
  // form name으로 input들이 모두 같은 키 사용 → formData.getAll(name)으로 회수.
  name: string
  disabled?: boolean
}

const GROUP_LABEL: Record<ProjectOption['kind'], string> = {
  client: '클라이언트',
  internal: '내부 프로젝트',
}

export function ProjectMultiSelect({
  options,
  defaultSelected,
  name,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>(defaultSelected)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
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

  function toggle(id: string) {
    setSelected((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id],
    )
  }

  function clearAll() {
    setSelected([])
  }

  // kind별 그룹화
  const groups: { kind: ProjectOption['kind']; items: ProjectOption[] }[] = []
  for (const opt of options) {
    let g = groups.find((x) => x.kind === opt.kind)
    if (!g) {
      g = { kind: opt.kind, items: [] }
      groups.push(g)
    }
    g.items.push(opt)
  }

  const selectedNames = selected
    .map((id) => options.find((o) => o.id === id)?.name)
    .filter((n): n is string => !!n)

  return (
    <div className="relative" ref={rootRef}>
      {/* form 값 전달용: 선택된 각 id마다 hidden input. */}
      {selected.map((id) => (
        <input key={id} type="hidden" name={name} value={id} />
      ))}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-8 w-full items-center gap-1.5 rounded-md border border-border bg-background px-2 text-left text-sm hover:bg-muted disabled:opacity-60"
      >
        <span className="min-w-0 flex-1 truncate text-xs">
          {selectedNames.length === 0 ? (
            <span className="text-muted-foreground">선택 안 됨</span>
          ) : selectedNames.length <= 2 ? (
            selectedNames.join(', ')
          ) : (
            <>
              {selectedNames.slice(0, 2).join(', ')}{' '}
              <span className="text-muted-foreground">+{selectedNames.length - 2}</span>
            </>
          )}
        </span>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </button>

      {open ? (
        <div
          role="listbox"
          className="absolute left-0 top-full z-30 mt-1 w-full min-w-[200px] overflow-hidden rounded-md border border-border bg-background shadow-md"
        >
          {selected.length > 0 ? (
            <div className="flex items-center justify-between border-b border-border px-2 py-1.5">
              <span className="text-[10px] text-muted-foreground">
                {selected.length}개 선택됨
              </span>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
                전체 해제
              </button>
            </div>
          ) : null}

          <ul className="max-h-64 overflow-y-auto py-1">
            {groups.map((g, gi) => (
              <li key={g.kind}>
                <div
                  className={
                    gi === 0
                      ? 'px-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'
                      : 'mt-1 border-t border-border px-2 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'
                  }
                >
                  {GROUP_LABEL[g.kind]}
                </div>
                <ul>
                  {g.items.map((opt) => {
                    const checked = selected.includes(opt.id)
                    return (
                      <li key={opt.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={checked}
                          onClick={() => toggle(opt.id)}
                          className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-muted"
                        >
                          <span
                            className={
                              checked
                                ? 'grid size-4 shrink-0 place-items-center rounded border border-primary bg-primary text-primary-foreground'
                                : 'grid size-4 shrink-0 place-items-center rounded border border-border'
                            }
                          >
                            {checked ? <Check className="size-3" /> : null}
                          </span>
                          <span className="flex-1 truncate">{opt.name}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
