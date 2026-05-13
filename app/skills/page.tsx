import { CraftTable } from '@/components/skills/CraftTable'
import { plugins } from '@/lib/mock-data'

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
      </div>
      <CraftTable plugins={plugins} />
    </div>
  )
}
