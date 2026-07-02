import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Plus, 
  AlertTriangle, 
  HandCoins, 
  Calendar,
  PiggyBank
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get current date details
  const now = new Date()
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0')
  const currentYear = now.getFullYear()
  const monthYearStr = `${currentMonth}-${currentYear}`

  const firstDayOfMonth = `${currentYear}-${currentMonth}-01`
  const lastDayOfMonth = new Date(currentYear, now.getMonth() + 1, 0).toISOString().split('T')[0]

  // Run database queries in parallel
  const [
    { data: allTransactions },
    { data: currentBudget },
    { data: debtsLoans }
  ] = await Promise.all([
    supabase.from('transactions').select('*').eq('user_id', user.id),
    supabase.from('monthly_budgets').select('*').eq('user_id', user.id).eq('month_year', monthYearStr).single(),
    supabase.from('debts_loans').select('*').eq('user_id', user.id).eq('status', 'active')
  ])

  // Get recent 5 transactions locally in memory from allTransactions
  const recentTransactions = allTransactions
    ? [...allTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    : []

  // Calculate totals
  let totalBalance = 0
  let totalIncomeAllTime = 0
  let totalExpenseAllTime = 0
  let currentMonthIncome = 0
  let currentMonthExpense = 0

  if (allTransactions) {
    allTransactions.forEach((t) => {
      const amt = Number(t.amount)
      const isCurrentMonth = t.date >= firstDayOfMonth && t.date <= lastDayOfMonth

      if (t.type === 'income') {
        totalIncomeAllTime += amt
        totalBalance += amt
        if (isCurrentMonth) currentMonthIncome += amt
      } else {
        totalExpenseAllTime += amt
        totalBalance -= amt
        if (isCurrentMonth) currentMonthExpense += amt
      }
    })
  }

  // Budget calculations and warnings
  const budgetLimit = currentBudget ? Number(currentBudget.monthly_budget) : 0
  const budgetProgressPercent = budgetLimit > 0 ? (currentMonthExpense / budgetLimit) * 100 : 0
  const isBudgetWarning = budgetLimit > 0 && budgetProgressPercent >= 85

  // Debt/loan totals
  let totalDebtsActive = 0
  let totalLoansActive = 0

  if (debtsLoans) {
    debtsLoans.forEach((dl) => {
      const rem = Number(dl.remaining_amount)
      if (dl.type === 'debt') {
        totalDebtsActive += rem
      } else {
        totalLoansActive += rem
      }
    })
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full animate-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            <span className="text-gradient">Tổng quan tài chính</span>
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm mt-1">Hôm nay là ngày {formatDate(now)}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-600/10 cursor-pointer active:scale-[0.96]"
          >
            <Plus className="w-4 h-4" />
            Thêm giao dịch
          </Link>
        </div>
      </div>

      {/* Budget warnings */}
      {isBudgetWarning && (
        <div className={`border p-4 rounded-2xl flex items-start gap-3.5 animate-pulse ${
          budgetProgressPercent > 100 
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-450' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
        }`}>
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">
              {budgetProgressPercent > 100 ? 'Cảnh báo vượt hạn mức!' : 'Chú ý: Sắp chạm hạn mức chi tiêu!'}
            </h4>
            <p className="text-xs mt-1 leading-relaxed opacity-90">
              {budgetProgressPercent > 100 
                ? `Bạn đã chi tiêu ${formatCurrency(currentMonthExpense)}, vượt quá ngân sách tháng này (${formatCurrency(budgetLimit)})!`
                : `Bạn đã chi tiêu ${formatCurrency(currentMonthExpense)} (${budgetProgressPercent.toFixed(1)}% của ngân sách tháng này là ${formatCurrency(budgetLimit)}). Hãy cân đối chi tiêu!`
              }
            </p>
          </div>
        </div>
      )}

      {/* Financial metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Balance */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-650/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-indigo-550 dark:text-indigo-400" />
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tổng số dư khả dụng</p>
          <h3 className={`text-2xl font-bold mt-1 tracking-tight ${totalBalance >= 0 ? 'text-slate-805 dark:text-white' : 'text-rose-550 dark:text-rose-400'}`}>
            {formatCurrency(totalBalance)}
          </h3>
          <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-2">Tổng thu nhập trừ tổng chi tiêu tích lũy</p>
        </div>

        {/* Card 2: Income */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-emerald-650 dark:text-emerald-400" />
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
              Tháng {currentMonth}
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-550 dark:text-slate-400">Thu nhập tháng này</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tracking-tight">
            {formatCurrency(currentMonthIncome)}
          </h3>
          <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-2">Tổng thực nhận: {formatCurrency(totalIncomeAllTime)}</p>
        </div>

        {/* Card 3: Expenses */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-600/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-rose-550 dark:text-rose-450" />
            </div>
            <div className="flex items-center gap-1 text-[10px] text-rose-650 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full font-bold">
              Tháng {currentMonth}
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-550 dark:text-slate-400">Chi tiêu tháng này</p>
          <h3 className="text-2xl font-bold text-rose-550 dark:text-rose-450 mt-1 tracking-tight">
            {formatCurrency(currentMonthExpense)}
          </h3>
          <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-2">Tổng đã chi: {formatCurrency(totalExpenseAllTime)}</p>
        </div>
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions (2 cols) */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-2 shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Giao dịch gần đây</h3>
            <Link 
              href="/dashboard/transactions" 
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Xem tất cả
            </Link>
          </div>

          {!recentTransactions || recentTransactions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-2xl">
              <Calendar className="w-8 h-8 text-slate-400 dark:text-slate-650 mx-auto mb-2" />
              <p className="text-sm text-slate-450 dark:text-slate-500">Chưa có giao dịch nào được ghi nhận</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((t) => (
                <div key={t.id} className="flex justify-between items-center p-3 hover:bg-white/40 dark:hover:bg-white/5 rounded-xl transition-all border border-transparent">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      t.type === 'income' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-450'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate max-w-[180px] sm:max-w-[300px]">
                        {t.description || t.category}
                      </p>
                      <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">{t.category} &bull; {formatDate(t.date)}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${
                    t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-450'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(Number(t.amount))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Debts & Loans Summary (1 col) */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between shadow-sm dark:shadow-none">
          <div>
            <h3 className="text-lg font-bold text-slate-805 dark:text-white mb-6">Nợ & Cho vay active</h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-7 bg-rose-500 rounded-full" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Khoản nợ phải trả</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white mt-0.5">{formatCurrency(totalDebtsActive)}</p>
                  </div>
                </div>
                <HandCoins className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-7 bg-emerald-500 rounded-full" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Khoản cho vay phải đòi</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white mt-0.5">{formatCurrency(totalLoansActive)}</p>
                  </div>
                </div>
                <HandCoins className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/80">
            <Link
              href="/dashboard/debts-loans"
              className="w-full py-2.5 btn-glass text-center text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer rounded-xl"
            >
              Chi tiết các khoản nợ/cho vay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
