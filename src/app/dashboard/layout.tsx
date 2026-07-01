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
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground transition-colors duration-200">
      <DashboardSidebar username={username} />
      {/* Added bottom padding pb-20 on mobile to prevent bottom navigation bar from overlapping content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-500/[0.02] dark:bg-zinc-950/[0.15] pb-20 md:pb-0">
        {children}
      </div>
    </div>
  )
}
