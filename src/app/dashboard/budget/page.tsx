import React, { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BudgetClient from './budget-client'
import BudgetSkeleton from './budget-skeleton'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

async function BudgetData() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch budgets and transactions in parallel for optimization
  const [
    { data: budgets },
    { data: transactions }
  ] = await Promise.all([
    supabase.from('monthly_budgets').select('*').eq('user_id', user.id),
    supabase.from('transactions').select('*').eq('user_id', user.id),
  ])

  return (
    <BudgetClient
      initialBudgets={budgets || []}
      transactions={transactions || []}
    />
  )
}

export default function BudgetPage() {
  return (
    <Suspense fallback={<BudgetSkeleton />}>
      <BudgetData />
    </Suspense>
  )
}
