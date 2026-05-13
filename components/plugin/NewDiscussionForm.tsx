'use client'

import { useRef, useState } from 'react'
import { Plus, Send } from 'lucide-react'
import { createDiscussionAction } from '@/app/actions/content'

export function NewDiscussionForm({ pluginId }: { pluginId: string }) {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  if (!open) {
    return (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
        >
          <Plus className="size-3.5" />
          새 의견 작성
        </button>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await createDiscussionAction(fd)
        formRef.current?.reset()
        setOpen(false)
      }}
      className="rounded-lg border border-border bg-background p-4"
    >
      <input type="hidden" name="pluginId" value={pluginId} />
      <label className="block text-xs font-medium text-foreground">
        의견 제목
      </label>
      <input
        type="text"
        name="title"
        required
        autoFocus
        placeholder="예: 발화자 톤이 평탄하게 정리됨"
        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <p className="mt-1 text-[11px] text-muted-foreground">
        써보면서 발견한 개선점·아쉬움을 한 줄로 남겨주세요.
      </p>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
        >
          취소
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Send className="size-3.5" />
          등록
        </button>
      </div>
    </form>
  )
}
