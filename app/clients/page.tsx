import { Briefcase } from 'lucide-react'
import { ClientCard } from '@/components/clients/ClientCard'
import { NewClientCta } from '@/components/clients/NewClientCta'
import {
  clientPlugins,
  getClientMeta,
  getProposalsByPlugin,
  members,
} from '@/lib/mock-data'

export default function ClientsPage() {
  const rows = clientPlugins
    .map((plugin) => ({
      plugin,
      meta: getClientMeta(plugin.id),
      openProposals: getProposalsByPlugin(plugin.id).filter(
        (p) => p.status === 'open' || p.status === 'in-review',
      ).length,
    }))
    .filter(
      (row): row is { plugin: typeof row.plugin; meta: NonNullable<typeof row.meta>; openProposals: number } =>
        !!row.meta,
    )

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            <Briefcase className="size-3.5" />
            Client Hub
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Clients</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            고객사의 KPI, Roadmap, 연결할 Skills, 내부 담당자 및 관련 정보를 한 곳에서 관리하세요.
          </p>
        </div>
        <NewClientCta />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {rows.map((row) => (
          <ClientCard
            key={row.plugin.id}
            plugin={row.plugin}
            meta={row.meta}
            memberTotal={members.length}
            openProposals={row.openProposals}
          />
        ))}
      </div>

      <NewClientCta variant="card" />
    </div>
  )
}
