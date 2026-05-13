'use client'

import { createContext, useContext, type ReactNode } from 'react'

type AdminContextValue = {
  isAdmin: boolean
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined)

// 실제 admin 상태는 서버의 ax_admin httpOnly 쿠키가 단일 출처(source of truth).
// 이 컨텍스트는 서버 컴포넌트(layout)가 매 렌더에서 읽어 prop으로 내려준 값을
// 클라이언트 트리에 노출하는 용도. 활성화/해제는 server action으로만 이루어지고,
// action 후 revalidatePath('/', 'layout')으로 새 값이 흘러들어온다.
export function AdminProvider({
  initialIsAdmin,
  children,
}: {
  initialIsAdmin: boolean
  children: ReactNode
}) {
  return (
    <AdminContext.Provider value={{ isAdmin: initialIsAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return ctx
}
