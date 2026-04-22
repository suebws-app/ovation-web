import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <>
      {/* TODO: Top bar — Event switcher, user menu, notifications */}
      {/* TODO: Desktop sidebar / Mobile bottom nav */}
      <main className="flex-1">{children}</main>
    </>
  )
}
