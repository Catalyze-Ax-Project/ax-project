import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AdminProvider } from '@/lib/admin-context'
import { SidebarProvider } from '@/lib/sidebar-context'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Toaster } from '@/components/ui/sonner'
import { getCurrentMember, isAdminSession } from '@/lib/auth'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Catalyze AX Project',
  description: '카탈라이즈 조직의 AI 자산 플랫폼',
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const member = await getCurrentMember()
  const isAdmin = member ? await isAdminSession() : false
  const headerUser = member
    ? { name: member.name, role: member.role, initials: member.avatarInitials }
    : null

  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        {member ? (
          <AdminProvider initialIsAdmin={isAdmin}>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Header user={headerUser} />
                  <main className="flex-1 bg-muted/30 p-4 sm:p-6">{children}</main>
                </div>
              </div>
              <Toaster />
            </SidebarProvider>
          </AdminProvider>
        ) : (
          children
        )}
      </body>
    </html>
  )
}
