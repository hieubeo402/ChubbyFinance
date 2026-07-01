import React, { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ReportsClient from './reports-client'
import ReportsSkeleton from './reports-skeleton'

export const dynamic = 'force-dynamic'

async function ReportsData() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch all transactions to build overall comparison charts
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)

  return <ReportsClient transactions={transactions || []} />
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsSkeleton />}>
      <ReportsData />
    </Suspense>
  )
}
