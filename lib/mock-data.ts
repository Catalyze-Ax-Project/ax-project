// ============================================================================
// Catalyze Harness — Mock Data
// 시연용 더미 데이터. 실제 API 연동 전까지 모든 페이지가 이 파일을 import한다.
//
// Skill 데이터의 일부는 외부 plugin repo (Catalyze-Ax-Project/plugin) md 파일에서
// 빌드 시점에 동기화된다. lib/plugins-data.ts 참조.
// 본 파일의 plugins 배열에는 그 외부 skill들이 자동으로 포함된다 (파일 하단 참고).
// ============================================================================

import { externalSkills } from './plugins-data'

export type Team = 'common' | 'bd' | 'marketing' | 'dev-growth' | 'operations'
export type PluginKind = 'client' | 'skill' | 'agent' | 'common'
export type ProposalStatus = 'open' | 'in-review' | 'merged' | 'closed'
export type DiscussionStatus = 'open' | 'resolved'

export type Plugin = {
  id: string
  name: string
  kind: PluginKind
  team: Team
  description: string
  tags?: string[]
  updatedAt: string
  skillsCount: number
  discussionsCount: number
  proposalsCount: number
  adoptionCount: number
  contentPreview: string
}

export type Discussion = {
  id: string
  pluginId: string
  title: string
  author: string
  createdAt: string
  status: DiscussionStatus
  commentsCount: number
  linkedProposalId?: string
}

export type Proposal = {
  id: string
  pluginId: string
  title: string
  author: string
  status: ProposalStatus
  createdAt: string
  description: string
  linkedDiscussionId?: string
}

export type Change = {
  id: string
  pluginId: string
  message: string
  author: string
  createdAt: string
}

export type Member = {
  id: string
  name: string
  team: Team
  role: string
  weeklyUsage: number
  avatarInitials: string
}

export type Combo = {
  id: string
  clientId: string
  skillId: string
  lastUsedAt: string
}

export const currentUser: {
  id: string
  name: string
  team: Team
  role: string
} = {
  id: 'u-jun',
  name: 'Jun Lee',
  team: 'dev-growth',
  role: 'Researcher',
}

export const TEAM_LABEL: Record<Team, string> = {
  common: '전사 공통',
  bd: 'BD',
  marketing: 'Marketing',
  'dev-growth': 'Dev Growth',
  operations: 'Operations',
}

export const KIND_LABEL: Record<PluginKind, string> = {
  common: 'Common',
  client: 'Client',
  skill: 'Skill',
  agent: 'Agent',
}

export const PROPOSAL_STATUS_LABEL: Record<ProposalStatus, string> = {
  open: '대기중',
  'in-review': '검토중',
  merged: '반영됨',
  closed: '닫힘',
}

export const DISCUSSION_STATUS_LABEL: Record<DiscussionStatus, string> = {
  open: '진행중',
  resolved: '반영 완료',
}

// ----------------------------------------------------------------------------
// Plugins
// - builtInPlugins: 클라이언트 3개만 더미로 유지 (Skill/Common 더미 모두 제거됨)
// - externalSkills (plugin repo)에서 가져온 Skill을 합쳐 최종 `plugins`로 export
// ----------------------------------------------------------------------------

const builtInPlugins: Plugin[] = [
  {
    id: 'client-ripple',
    name: 'Ripple',
    kind: 'client',
    team: 'operations',
    description: '',
    tags: ['클라이언트', 'Ripple', 'Payments'],
    updatedAt: '2026-04-17T15:24:00.000Z',
    skillsCount: 0,
    discussionsCount: 0,
    proposalsCount: 0,
    adoptionCount: 0,
    contentPreview: '# Client: Ripple\n\n- 톤: 전문적/격식. 금융 기관 대상 커뮤니케이션 기본값.\n- 용어: XRP Ledger, RLUSD (USD 스테이블), Interledger Protocol, Ripple Payments.\n- 최근 로드맵: RLUSD 확장, 기관용 custody, 유럽 결제 라이선스.\n',
  },
  {
    id: 'client-squid',
    name: 'Squid',
    kind: 'client',
    team: 'operations',
    description: '',
    tags: ['클라이언트', 'Squid'],
    updatedAt: '2026-04-10T05:55:00.000Z',
    skillsCount: 0,
    discussionsCount: 0,
    proposalsCount: 0,
    adoptionCount: 0,
    contentPreview: '# Client: Squid\n\n크로스체인 리퀴디티 라우터. Axelar 기반.\n',
  },
  {
    id: 'client-midnight',
    name: 'Midnight',
    kind: 'client',
    team: 'operations',
    description: '',
    tags: ['클라이언트', 'Midnight', 'Privacy'],
    updatedAt: '2026-04-12T07:30:00.000Z',
    skillsCount: 0,
    discussionsCount: 0,
    proposalsCount: 0,
    adoptionCount: 0,
    contentPreview: '# Client: Midnight\n\n- 톤: 기술적/간결. 개발자 대상 기본값.\n- 용어: shielded transactions, Compact DSL, Kachina 프로토콜.\n- 최근 로드맵: 메인넷 런칭, Glacier Drop, SDK 공개.\n',
  },
]

// External skills sourced from Catalyze-Ax-Project/plugin repo.
const externalSkillsAsPlugins: Plugin[] = externalSkills.map((s) => ({
  id: s.id,
  name: s.name,
  kind: 'skill',
  team: s.team,
  description: s.core_value,
  tags: s.tags ?? [],
  updatedAt: s.updated_at,
  skillsCount: 0,
  discussionsCount: 0,
  proposalsCount: 0,
  adoptionCount: 0,
  contentPreview: s.body,
}))

export const plugins: Plugin[] = [...builtInPlugins, ...externalSkillsAsPlugins]

// ----------------------------------------------------------------------------
// Discussions / Proposals / Changes / Combos — 모두 비움.
// 시연 더미 데이터를 제거. 실제 활동은 외부 plugin repo에서 들어오거나
// 사용자가 추가하면서 채워질 예정.
// ----------------------------------------------------------------------------

export const discussions: Discussion[] = []

export const proposals: Proposal[] = []

export const changes: Change[] = []


// ----------------------------------------------------------------------------
// Members (5명). currentUser = Jun Lee.
// ----------------------------------------------------------------------------

export const members: Member[] = [
  { id: 'u-jay', name: 'Jay Lee', team: 'operations', role: 'Co-Founder', weeklyUsage: 9, avatarInitials: 'JL' },
  { id: 'u-harry', name: 'Harry Park', team: 'operations', role: 'Operation Manager', weeklyUsage: 14, avatarInitials: 'HP' },
  { id: 'u-jayp', name: 'Jay Park', team: 'bd', role: 'BD Lead', weeklyUsage: 11, avatarInitials: 'JP' },
  { id: 'u-jake', name: 'Jake Ku', team: 'dev-growth', role: 'Head of growth', weeklyUsage: 6, avatarInitials: 'JK' },
  { id: 'u-jun', name: 'Jun Lee', team: 'dev-growth', role: 'Research Analyst', weeklyUsage: 12, avatarInitials: 'JL' },
]

// ----------------------------------------------------------------------------
// Combos — 최근 사용 + 추천 조합 (Overview 카드용)
// ----------------------------------------------------------------------------

export const combos: Combo[] = []

// ----------------------------------------------------------------------------
// 집계 통계 (Overview Hero용)
// ----------------------------------------------------------------------------

export const weeklyStats = {
  mergedChanges: 0,
  openDiscussions: discussions.filter((d) => d.status === 'open').length,
  openProposals: proposals.filter((p) => p.status === 'open' || p.status === 'in-review').length,
  staleDiscussions: 0,
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

export const getPluginById = (id: string) => plugins.find((p) => p.id === id)
export const getDiscussionsByPlugin = (pluginId: string) => discussions.filter((d) => d.pluginId === pluginId)
export const getProposalsByPlugin = (pluginId: string) => proposals.filter((p) => p.pluginId === pluginId)
export const getChangesByPlugin = (pluginId: string) => changes.filter((c) => c.pluginId === pluginId)
export const getMemberByName = (name: string) => members.find((m) => m.name === name)
export const getMemberById = (id: string) => members.find((m) => m.id === id)

export const skillPlugins = plugins.filter((p) => p.kind === 'skill')
export const clientPlugins = plugins.filter((p) => p.kind === 'client')

// ----------------------------------------------------------------------------
// Client metadata — 플러그인 형식 이상의 "고객사 세팅" 정보.
// ----------------------------------------------------------------------------

export type ClientMeta = {
  pluginId: string
  ownerId: string
  onboardedAt: string
  linkedSkillIds: string[]
  tagline: string
}

export const clientMetas: Record<string, ClientMeta> = {
  'client-ripple': {
    pluginId: 'client-ripple',
    ownerId: 'u-jake',
    onboardedAt: '2026-01-15T00:00:00.000Z',
    linkedSkillIds: [],
    tagline: 'Global Payments · XRP Ledger',
  },
  'client-midnight': {
    pluginId: 'client-midnight',
    ownerId: 'u-jayp',
    onboardedAt: '2026-04-10T00:00:00.000Z',
    linkedSkillIds: [],
    tagline: 'Privacy Sidechain · Cardano 계열',
  },
  'client-squid': {
    pluginId: 'client-squid',
    ownerId: 'u-jayp',
    onboardedAt: '2026-03-25T00:00:00.000Z',
    linkedSkillIds: [],
    tagline: 'Cross-chain Router · Axelar 기반',
  },
}

export const getClientMeta = (pluginId: string) => clientMetas[pluginId]

// ----------------------------------------------------------------------------
// Member → 담당 프로젝트 매핑.
// 프로젝트는 클라이언트 플러그인 id이거나, 아래 internalProjects 중 하나.
// 나중에 Admin 모드에서 직접 편집 가능하게 열 예정.
// ----------------------------------------------------------------------------

export const internalProjects: { id: string; name: string }[] = [
  { id: 'catalyze-operations', name: 'Catalyze Operation' },
]

export const memberAssignments: Record<string, string[]> = {
  'u-jay': ['catalyze-operations'],
  'u-harry': ['catalyze-operations'],
  'u-jayp': ['client-midnight', 'client-squid'],
  'u-jake': ['client-ripple'],
  'u-jun': ['client-ripple', 'client-midnight'],
}

export type ProjectRef = {
  id: string
  name: string
  href?: string
}

export function getProjectRef(id: string): ProjectRef | undefined {
  const plugin = getPluginById(id)
  if (plugin && plugin.kind === 'client') {
    return { id, name: plugin.name, href: `/clients/${id}` }
  }
  const internal = internalProjects.find((p) => p.id === id)
  if (internal) return { id, name: internal.name }
  return undefined
}

export function getMemberProjects(memberId: string): ProjectRef[] {
  const ids = memberAssignments[memberId] ?? []
  return ids
    .map((id) => getProjectRef(id))
    .filter((p): p is ProjectRef => !!p)
}

// kind-aware 라우팅 헬퍼 — 플러그인 종류별로 올바른 상세 URL 리턴.
export function getPluginHref(pluginOrId: Plugin | string | undefined): string {
  const plugin =
    typeof pluginOrId === 'string' ? getPluginById(pluginOrId) : pluginOrId
  if (!plugin) return '/plugins'
  if (plugin.kind === 'client') return `/clients/${plugin.id}`
  if (plugin.kind === 'skill') return `/skills/${plugin.id}`
  return `/plugins/${plugin.id}`
}
