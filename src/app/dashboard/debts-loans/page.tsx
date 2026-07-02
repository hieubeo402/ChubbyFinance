import React, { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DebtsLoansClient from './debts-loans-client'
import DebtsLoansSkeleton from './debts-loans-skeleton'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

async function DebtsLoansData() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch debts and loans along with nested payment history
  const { data: debtsLoans } = await supabase
    .from('debts_loans')
    .select(`
      *,
      debt_loan_history (*)
    `)
    .eq('user_id', user.id)
    .order('due_date', { ascending: true })

  // Sort payment history locally (newest first) for clean UI layout
  const formattedData = debtsLoans
    ? debtsLoans.map((item: any) => ({
        ...item,
        debt_loan_history: item.debt_loan_history
          ? [...item.debt_loan_history].sort(
              (a: any, b: any) => new Date(b.paid_date).getTime() - new Date(a.paid_date).getTime()
            )
          : [],
      }))
    : []

  return <DebtsLoansClient initialData={formattedData} />
}

export default function DebtsLoansPage() {
  return (
    <Suspense fallback={<DebtsLoansSkeleton />}>
      <DebtsLoansData />
    </Suspense>
  )
}
