'use server'

import 'server-only'
import { revalidatePath } from 'next/cache'
import {
  changes,
  discussions,
  getPluginById,
  proposals,
  type Change,
  type Discussion,
  type Proposal,
} from '@/lib/mock-data'
import { getCurrentMember } from '@/lib/auth'

function nextId(prefix: 'd' | 'p' | 'c'): string {
  const pool: { id: string }[] =
    prefix === 'd' ? discussions : prefix === 'p' ? proposals : changes
  let max = 0
  for (const item of pool) {
    const m = item.id.match(/^[a-z]-(\d+)$/i)
    if (m) {
      const n = Number(m[1])
      if (n > max) max = n
    }
  }
  return `${prefix}-${String(max + 1).padStart(3, '0')}`
}

function pluginRoutes(pluginId: string): string[] {
  const plugin = getPluginById(pluginId)
  if (!plugin) return ['/plugins']
  if (plugin.kind === 'client') return ['/clients', `/clients/${pluginId}`]
  if (plugin.kind === 'skill') return ['/skills', `/skills/${pluginId}`]
  return ['/plugins', `/plugins/${pluginId}`]
}

export async function createDiscussionAction(formData: FormData): Promise<void> {
  const me = await getCurrentMember()
  if (!me) throw new Error('인증이 필요합니다.')

  const pluginId = String(formData.get('pluginId') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim()

  if (!pluginId || !title) return
  if (!getPluginById(pluginId)) throw new Error('알 수 없는 플러그인입니다.')

  const discussion: Discussion = {
    id: nextId('d'),
    pluginId,
    title,
    author: me.name,
    createdAt: new Date().toISOString(),
    status: 'open',
    commentsCount: 0,
  }
  discussions.push(discussion)

  for (const path of pluginRoutes(pluginId)) revalidatePath(path)
  revalidatePath('/')
}

export async function convertDiscussionToProposalAction(
  formData: FormData,
): Promise<void> {
  const me = await getCurrentMember()
  if (!me) throw new Error('인증이 필요합니다.')

  const discussionId = String(formData.get('discussionId') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()

  if (!discussionId || !title) return
  const d = discussions.find((x) => x.id === discussionId)
  if (!d) throw new Error('해당 의견을 찾지 못했습니다.')

  const proposal: Proposal = {
    id: nextId('p'),
    pluginId: d.pluginId,
    title,
    author: me.name,
    status: 'open',
    createdAt: new Date().toISOString(),
    description: description || `${d.id} 의견을 반영한 제안입니다.`,
    linkedDiscussionId: d.id,
  }
  proposals.push(proposal)
  d.linkedProposalId = proposal.id

  for (const path of pluginRoutes(d.pluginId)) revalidatePath(path)
  revalidatePath('/proposals')
  revalidatePath('/')
}

export async function mergeProposalAction(formData: FormData): Promise<void> {
  const me = await getCurrentMember()
  if (!me) throw new Error('인증이 필요합니다.')

  const proposalId = String(formData.get('proposalId') ?? '').trim()
  if (!proposalId) return

  const p = proposals.find((x) => x.id === proposalId)
  if (!p) throw new Error('해당 제안을 찾지 못했습니다.')
  if (p.status === 'merged' || p.status === 'closed') return

  p.status = 'merged'

  if (p.linkedDiscussionId) {
    const d = discussions.find((x) => x.id === p.linkedDiscussionId)
    if (d) d.status = 'resolved'
  }

  const change: Change = {
    id: nextId('c'),
    pluginId: p.pluginId,
    message: `${p.title} 반영 (${p.id})`,
    author: me.name,
    createdAt: new Date().toISOString(),
  }
  changes.push(change)

  for (const path of pluginRoutes(p.pluginId)) revalidatePath(path)
  revalidatePath('/proposals')
  revalidatePath(`/proposals/${p.id}`)
  revalidatePath('/')
}
