import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardSidebar from '@/components/dashboard-sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  const username = profile?.username || user.email?.split('@')[0] || 'User'

  return (
    <div className="flex min-h-screen bg-black text-white">
      <DashboardSidebar username={username} />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-zinc-950/40">
        {children}
      </div>
    </div>
  )
}
