import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BudgetClient from './budget-client'

export const dynamic = 'force-dynamic'

export default async function BudgetPage() {
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
