import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardSidebar from '@/components/dashboard-sidebar'

export const runtime = 'edge'

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
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Background glowing blobs for high-contrast Apple glass refraction */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[130px] dark:blur-[160px]" />
        <div className="absolute bottom-[5%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-400/8 dark:bg-emerald-500/5 blur-[130px] dark:blur-[160px]" />
        <div className="absolute top-[35%] right-[15%] w-[40%] h-[40%] rounded-full bg-pink-400/5 dark:bg-purple-600/5 blur-[110px] dark:blur-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row w-full min-h-screen">
        <DashboardSidebar username={username} />
        {/* Added bottom padding pb-20 on mobile to prevent bottom navigation bar from overlapping content */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-500/[0.01] dark:bg-zinc-950/[0.04] pb-20 md:pb-0 relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}
