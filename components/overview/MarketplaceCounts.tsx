import { Puzzle, Sparkles, Briefcase, Bot } from 'lucide-react'
import { plugins, skillPlugins, clientPlugins } from '@/lib/mock-data'

export function MarketplaceCounts() {
  const totalPlugins = plugins.length
  const totalSkills = skillPlugins.length
  const totalClients = clientPlugins.length

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Count icon={<Puzzle className="size-4" />} label="Plugins" value={totalPlugins} />
      <Count icon={<Sparkles className="size-4" />} label="Skills" value={totalSkills} />
      <Count icon={<Briefcase className="size-4" />} label="Clients" value={totalClients} />
      <Count icon={<Bot className="size-4" />} label="Agents" value={0} note="Coming soon" muted />
    </section>
  )
}

function Count({
  icon,
  label,
  value,
  note,
  muted,
}: {
  icon: React.ReactNode
  label: string
  value: number
  note?: string
  muted?: boolean
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-background p-4 ${
        muted ? 'opacity-60' : ''
      }`}
    >
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      {note ? <div className="mt-0.5 text-[11px] text-muted-foreground">{note}</div> : null}
    </div>
  )
}
