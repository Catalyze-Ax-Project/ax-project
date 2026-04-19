'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type SidebarContextValue = {
  open: boolean
  setOpen: (value: boolean) => void
  toggle: () => void
  close: () => void
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const value: SidebarContextValue = {
    open,
    setOpen,
    toggle: () => setOpen((prev) => !prev),
    close: () => setOpen(false),
  }

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within a SidebarProvider')
  return ctx
}
