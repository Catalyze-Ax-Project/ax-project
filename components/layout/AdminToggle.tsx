'use client'

import { ShieldCheck } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useAdmin } from '@/lib/admin-context'

export function AdminToggle() {
  const { isAdmin, setIsAdmin } = useAdmin()

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5">
      <ShieldCheck
        className={
          isAdmin
            ? 'size-4 text-primary'
            : 'size-4 text-muted-foreground'
        }
      />
      <label htmlFor="admin-toggle" className="cursor-pointer text-sm font-medium">
        Admin 모드
      </label>
      <Switch id="admin-toggle" checked={isAdmin} onCheckedChange={setIsAdmin} />
    </div>
  )
}
