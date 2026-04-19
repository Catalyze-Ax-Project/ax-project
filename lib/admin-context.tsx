'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type AdminContextValue = {
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
  toggle: () => void
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  const value: AdminContextValue = {
    isAdmin,
    setIsAdmin,
    toggle: () => setIsAdmin((prev) => !prev),
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return ctx
}
