import React, { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TransactionsClient from './transactions-client'
import TransactionsSkeleton from './transactions-skeleton'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

async function TransactionsData() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  return <TransactionsClient initialTransactions={transactions || []} />
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<TransactionsSkeleton />}>
      <TransactionsData />
    </Suspense>
  )
}
