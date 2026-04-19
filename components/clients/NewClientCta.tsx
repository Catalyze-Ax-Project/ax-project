'use client'

import { Plus } from 'lucide-react'
import { toast } from 'sonner'

type Variant = 'button' | 'card'

export function NewClientCta({ variant = 'button' }: { variant?: Variant }) {
  const handleClick = () => {
    toast.info('새 고객사 세팅 플로우는 다음 단계에서 연결됩니다', {
      description: '톤앤매너 · 로드맵 · 연결할 Skills · 담당자를 단계별로 입력하는 위저드가 추가될 예정입니다.',
    })
  }

  if (variant === 'card') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-background/60 px-6 py-10 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
      >
        <span className="grid size-10 place-items-center rounded-full border border-border bg-background">
          <Plus className="size-4" />
        </span>
        <span className="font-medium">새 고객사 추가</span>
        <span className="max-w-sm text-xs text-muted-foreground">
          톤 / 로드맵 / 연결할 Skills / 내부 담당자를 세팅하고 클라이언트 맥락을 등록합니다.
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      <Plus className="size-4" />
      새 고객사 추가
    </button>
  )
}
