import { SkillsList } from '@/components/skills/SkillsList'
import { skillPlugins } from '@/lib/mock-data'

export default function SkillsPage() {
  const tags = Array.from(
    new Set(skillPlugins.flatMap((p) => p.tags ?? [])),
  ).sort()

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
        <p className="text-sm text-muted-foreground">
          재사용 가능한 작업 playbook입니다. 태그로 필터링해 필요한 스킬을 찾으세요.
        </p>
      </div>
      <SkillsList allTags={tags} />
    </div>
  )
}
