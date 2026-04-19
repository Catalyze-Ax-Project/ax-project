import { Bot } from 'lucide-react'

export default function AgentsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-background px-6 py-24 text-center">
        <div className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <Bot className="size-6" />
        </div>
        <h2 className="text-lg font-semibold">Agents는 다음 단계에서 지원됩니다</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Clients × Skills 조합을 자동 실행하는 에이전트 기능은 현재 설계 단계에 있습니다.
          이번 릴리즈에서는 플러그인을 복사해 본인이 쓰는 AI 도구(Claude, ChatGPT)에 붙여넣는 방식으로 사용하세요.
        </p>
      </div>
    </div>
  )
}
