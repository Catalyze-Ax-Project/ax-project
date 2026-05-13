/**
 * External plugin data — sourced from Catalyze-Ax-Project/plugin repo
 * via scripts/sync-plugins.mjs (build-time clone + parse).
 *
 * The generated JSON is committed-ignored; run `npm run sync-plugins`
 * (or any build/dev command) to refresh it.
 */
import generated from './data/plugins.generated.json'
import type { Team } from './mock-data'

export type SkillFrontmatter = {
  id: string
  name: string
  // 'skill'은 컨셉 전환 전 plugin md용. 새 plugin은 action/context/common/agent.
  kind: 'skill' | 'action' | 'context' | 'common' | 'agent'
  team: Team
  category: string
  core_value: string
  trigger?: string
  linked_clients?: string[]
  linked_skills?: string[]
  tags?: string[]
  authors?: string[]
  created_at: string
  updated_at: string
}

export type SkillRecord = SkillFrontmatter & {
  body: string
}

export type TeamRulesRecord = {
  kind: 'team-rules'
  team: Team
  title: string
  updated_at: string
  body: string
}

const data = generated as {
  skills: SkillRecord[]
  teams: TeamRulesRecord[]
  syncedAt: string
}

export const externalSkills: SkillRecord[] = data.skills
export const externalTeamRules: TeamRulesRecord[] = data.teams
export const pluginsSyncedAt: string = data.syncedAt

export function getExternalSkillById(id: string): SkillRecord | undefined {
  return externalSkills.find((s) => s.id === id)
}

export function getTeamRules(team: Team): TeamRulesRecord | undefined {
  return externalTeamRules.find((t) => t.team === team)
}
