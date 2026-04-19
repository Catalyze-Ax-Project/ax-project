// Mock 기준 시간 — 서버/클라이언트 하이드레이션 일관성을 위해 고정 기준점 사용.
const REFERENCE_TIME = new Date('2026-04-18T22:00:00.000Z').getTime()
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export function formatRelative(iso: string): string {
  const diff = REFERENCE_TIME - new Date(iso).getTime()
  if (diff < 0) return '방금 전'
  const hours = diff / (1000 * 60 * 60)
  if (hours < 1) return '방금 전'
  if (hours < 24) return `${Math.floor(hours)}시간 전`
  const days = hours / 24
  if (days < 7) return `${Math.floor(days)}일 전`
  if (days < 30) return `${Math.floor(days / 7)}주 전`
  return `${Math.floor(days / 30)}달 전`
}

export function isWithinWeek(iso: string): boolean {
  return REFERENCE_TIME - new Date(iso).getTime() <= WEEK_MS
}

export const REFERENCE_NOW = REFERENCE_TIME
