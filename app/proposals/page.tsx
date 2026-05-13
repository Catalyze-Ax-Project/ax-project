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
      </div>
      <ProposalsList proposals={[...proposals]} pluginById={pluginById} />
    </div>
  )
}
