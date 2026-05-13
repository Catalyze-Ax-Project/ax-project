import { ProposalsList } from '@/components/proposal/ProposalsList'
import { plugins, proposals, type Plugin } from '@/lib/mock-data'

export default function ProposalsPage() {
  const pluginById: Record<string, { id: string; name: string; kind: Plugin['kind'] }> = {}
  for (const p of plugins) {
    pluginById[p.id] = { id: p.id, name: p.name, kind: p.kind }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Proposals</h2>
        <p className="text-sm text-muted-foreground">
          전사 변경 제안 리스트입니다. 상태로 필터링해 검토 대기중인 제안을 우선 확인하세요.
        </p>
      </div>
      <ProposalsList proposals={[...proposals]} pluginById={pluginById} />
    </div>
  )
}
