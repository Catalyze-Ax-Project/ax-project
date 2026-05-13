'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { Pencil, Save, Trash2, X } from 'lucide-react'
import {
  deleteMemberAction,
  updateMemberAction,
  type MemberDeleteState,
  type MemberUpdateState,
} from '@/app/actions/members'
import { useAdmin } from '@/lib/admin-context'
import {
  TEAM_LABEL,
  type Member,
  type ProjectRef,
  type Team,
} from '@/lib/mock-data'
import {
  ProjectMultiSelect,
  type ProjectOption,
} from './ProjectMultiSelect'

export type { ProjectOption } from './ProjectMultiSelect'

type Row = Member & { projects: ProjectRef[]; projectIds: string[] }

const TEAM_OPTIONS: Team[] = ['common', 'bd', 'marketing', 'dev-growth', 'operations']

type Props = {
  rows: Row[]
  currentMemberId: string | null
  projectOptions: ProjectOption[]
}

export function MembersTable({ rows, currentMemberId, projectOptions }: Props) {
  const { isAdmin } = useAdmin()
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-background">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left font-medium">이름</th>
            <th className="px-4 py-3 text-left font-medium">팀</th>
            <th className="px-4 py-3 text-left font-medium">역할</th>
            <th className="px-4 py-3 text-left font-medium">담당 프로젝트</th>
            {isAdmin ? <th className="px-4 py-3 text-right font-medium">관리</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => {
            const isCurrent = m.id === currentMemberId
            if (editingId === m.id) {
              return (
                <EditRow
                  key={m.id}
                  member={m}
                  isCurrent={isCurrent}
                  projectOptions={projectOptions}
                  onClose={() => setEditingId(null)}
                />
              )
            }
            return (
              <ViewRow
                key={m.id}
                row={m}
                isCurrent={isCurrent}
                isAdmin={isAdmin}
                onEdit={() => setEditingId(m.id)}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ViewRow({
  row,
  isCurrent,
  isAdmin,
  onEdit,
}: {
  row: Row
  isCurrent: boolean
  isAdmin: boolean
  onEdit: () => void
}) {
  return (
    <tr
      className={
        isCurrent
          ? 'border-t border-border bg-primary/5'
          : 'border-t border-border hover:bg-muted/40'
      }
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={
              isCurrent
                ? 'grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground'
                : 'grid size-8 place-items-center rounded-full bg-muted text-xs font-semibold text-foreground'
            }
          >
            {row.avatarInitials}
          </span>
          <span className="font-medium">
            {row.name}
            {isCurrent ? (
              <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                나
              </span>
            ) : null}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{TEAM_LABEL[row.team]}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{row.role}</td>
      <td className="px-4 py-3">
        {row.projects.length === 0 ? (
          <span className="text-xs text-muted-foreground">—</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {row.projects.map((project) =>
              project.href ? (
                <Link
                  key={project.id}
                  href={project.href}
                  className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium hover:bg-muted"
                >
                  {project.name}
                </Link>
              ) : (
                <span
                  key={project.id}
                  className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium"
                >
                  {project.name}
                </span>
              ),
            )}
          </div>
        )}
      </td>
      {isAdmin ? (
        <td className="px-4 py-3 text-right">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs font-medium hover:bg-muted"
          >
            <Pencil className="size-3" />
            수정
          </button>
        </td>
      ) : null}
    </tr>
  )
}

function EditRow({
  member,
  isCurrent,
  projectOptions,
  onClose,
}: {
  member: Row
  isCurrent: boolean
  projectOptions: ProjectOption[]
  onClose: () => void
}) {
  const [updateState, updateFormAction, updatePending] = useActionState<
    MemberUpdateState,
    FormData
  >(updateMemberAction, { ok: false })

  const [deleteState, deleteFormAction, deletePending] = useActionState<
    MemberDeleteState,
    FormData
  >(deleteMemberAction, { ok: false })

  // 성공 시 row 닫기.
  useEffect(() => {
    if (updateState.ok) onClose()
  }, [updateState.ok, onClose])

  useEffect(() => {
    if (deleteState.ok) onClose()
  }, [deleteState.ok, onClose])

  return (
    <tr
      className={
        isCurrent ? 'border-t border-border bg-primary/5' : 'border-t border-border bg-muted/20'
      }
    >
      <td colSpan={5} className="px-4 py-3">
        <form action={updateFormAction} className="space-y-3">
          <input type="hidden" name="id" value={member.id} />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
            <label className="sm:col-span-4 flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                이름
              </span>
              <input
                name="name"
                type="text"
                defaultValue={member.name}
                required
                disabled={updatePending}
                className="h-8 rounded-md border border-border bg-background px-2 text-sm outline-none focus:border-primary disabled:opacity-60"
              />
            </label>
            <label className="sm:col-span-3 flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                팀
              </span>
              <select
                name="team"
                defaultValue={member.team}
                required
                disabled={updatePending}
                className="h-8 rounded-md border border-border bg-background px-2 text-sm outline-none focus:border-primary disabled:opacity-60"
              >
                {TEAM_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {TEAM_LABEL[t]}
                  </option>
                ))}
              </select>
            </label>
            <label className="sm:col-span-3 flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                역할
              </span>
              <input
                name="role"
                type="text"
                defaultValue={member.role}
                required
                disabled={updatePending}
                className="h-8 rounded-md border border-border bg-background px-2 text-sm outline-none focus:border-primary disabled:opacity-60"
              />
            </label>
            <label className="sm:col-span-2 flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                이니셜
              </span>
              <input
                name="initials"
                type="text"
                defaultValue={member.avatarInitials}
                maxLength={3}
                disabled={updatePending}
                className="h-8 rounded-md border border-border bg-background px-2 text-sm uppercase outline-none focus:border-primary disabled:opacity-60"
              />
            </label>
          </div>

          <div className="max-w-md">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              담당 프로젝트
            </div>
            {projectOptions.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">등록된 프로젝트가 없습니다.</p>
            ) : (
              <ProjectMultiSelect
                options={projectOptions}
                defaultSelected={member.projectIds}
                name="projects"
                disabled={updatePending}
              />
            )}
          </div>

          {updateState.error ? (
            <p className="text-[11px] text-destructive">{updateState.error}</p>
          ) : null}
          {deleteState.error ? (
            <p className="text-[11px] text-destructive">{deleteState.error}</p>
          ) : null}

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              {!isCurrent ? (
                <DeleteButton
                  memberId={member.id}
                  memberName={member.name}
                  formAction={deleteFormAction}
                  pending={deletePending}
                />
              ) : (
                <span className="text-[10px] text-muted-foreground">
                  본인 자신은 삭제할 수 없습니다
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onClose}
                disabled={updatePending || deletePending}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-muted disabled:opacity-60"
              >
                <X className="size-3" />
                취소
              </button>
              <button
                type="submit"
                disabled={updatePending || deletePending}
                className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                <Save className="size-3" />
                {updatePending ? '저장 중…' : '저장'}
              </button>
            </div>
          </div>
        </form>
      </td>
    </tr>
  )
}

function DeleteButton({
  memberId,
  memberName,
  formAction,
  pending,
}: {
  memberId: string
  memberName: string
  formAction: (formData: FormData) => void
  pending: boolean
}) {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const ok = window.confirm(
      `정말 ${memberName} 멤버를 삭제할까요?\n` +
        `이 멤버가 작성한 의견·제안·변경 이력은 이름 그대로 보존됩니다.`,
    )
    if (!ok) e.preventDefault()
  }

  return (
    <form action={formAction} onSubmit={onSubmit} className="inline">
      <input type="hidden" name="id" value={memberId} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1 rounded-md border border-destructive/40 bg-background px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-60"
      >
        <Trash2 className="size-3" />
        {pending ? '삭제 중…' : '삭제'}
      </button>
    </form>
  )
}
