'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { formatCurrency, getMonthYearString, formatDate } from '@/lib/utils'
import dynamic from 'next/dynamic'

const ReportsCharts = dynamic(() => import('./reports-charts'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
      <div className="glass-card rounded-3xl p-6 h-[400px] bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/80" />
      <div className="glass-card rounded-3xl p-6 h-[400px] bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/80" />
    </div>
  )
})
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  LineChart as LineIcon, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Percent
} from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  type: string
  category: string
  description: string | null
  date: string
}

export default function ReportsClient({ transactions }: { transactions: Transaction[] }) {
  const [mounted, setMounted] = useState(false)
  const now = new Date()
  const currentMonthYear = getMonthYearString(now) // e.g. "07-2026"
  const [selectedMonthYear, setSelectedMonthYear] = useState(currentMonthYear)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 1. Generate dropdown options for months (available from transaction history or last 6 months)
  const monthOptions: string[] = []
  for (let i = -6; i <= 0; i++) {
    const d = new Date()
    d.setMonth(now.getMonth() + i)
    const option = getMonthYearString(d)
    if (!monthOptions.includes(option)) {
      monthOptions.push(option)
    }
  }
  // Add any other month found in transactions that's not already in the list
  transactions.forEach(t => {
    const opt = getMonthYearString(t.date)
    if (!monthOptions.includes(opt)) {
      monthOptions.push(opt)
    }
  })
  // Sort months in descending order for the dropdown
  monthOptions.sort((a, b) => {
    const [ma, ya] = a.split('-').map(Number)
    const [mb, yb] = b.split('-').map(Number)
    return (yb * 12 + mb) - (ya * 12 + ma)
  })

  // 2. Prepare 6-Month Comparison Data
  const monthlyTrendData = useMemo(() => {
    const result = []
    for (let i = -5; i <= 0; i++) {
      const d = new Date()
      d.setMonth(now.getMonth() + i)
      const mY = getMonthYearString(d)
      
      const mTransactions = transactions.filter(t => getMonthYearString(t.date) === mY)
      const income = mTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
      const expense = mTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

      result.push({
        name: `T${mY.split('-')[0]}/${mY.split('-')[1].substring(2)}`,
        'Thu nhập': income,
        'Chi tiêu': expense,
      })
    }
    return result
  }, [transactions])

  // 3. Prepare Daily Data for Selected Month
  const dailyData = useMemo(() => {
    const [mStr, yStr] = selectedMonthYear.split('-')
    const monthIndex = Number(mStr) - 1
    const year = Number(yStr)
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

    const result = []
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = String(day).padStart(2, '0')
      const dateStr = `${year}-${mStr}-${dayStr}`
      
      const dayTransactions = transactions.filter(t => t.date === dateStr)
      const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
      const expense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

      result.push({
        day: dayStr,
        'Thu nhập': income,
        'Chi tiêu': expense,
      })
    }
    return result
  }, [transactions, selectedMonthYear])

  // 4. Calculate Stats for Selected Month
  const { monthIncome, monthExpense, netSavings, savingsRate } = useMemo(() => {
    const activeTransactions = transactions.filter(t => getMonthYearString(t.date) === selectedMonthYear)
    const income = activeTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
    const expense = activeTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
    const net = income - expense
    const rate = income > 0 ? (net / income) * 100 : 0
    return { monthIncome: income, monthExpense: expense, netSavings: net, savingsRate: rate }
  }, [transactions, selectedMonthYear])

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            <span className="text-gradient">Báo cáo & Phân tích</span>
          </h1>
          <p className="text-slate-555 dark:text-slate-400 text-sm mt-1">Xu hướng tài chính và biểu đồ tương quan thu chi</p>
        </div>

        <div className="glass-card rounded-xl px-4 py-2 shadow-sm dark:shadow-none flex items-center gap-3">
          <Calendar className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Chọn Tháng Báo Cáo:</span>
          <select
            value={selectedMonthYear}
            onChange={(e) => setSelectedMonthYear(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
          >
            {monthOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">
                Tháng {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Month Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Income Card */}
        <div className="glass-card rounded-3xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
            <ArrowUpCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tổng thu tháng này</p>
            <p className="text-lg font-bold text-slate-805 dark:text-white mt-0.5">{formatCurrency(monthIncome)}</p>
          </div>
        </div>

        {/* Expense Card */}
        <div className="glass-card rounded-3xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
          <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center shrink-0">
            <ArrowDownCircle className="w-5 h-5 text-rose-550 dark:text-rose-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tổng chi tháng này</p>
            <p className="text-lg font-bold text-slate-805 dark:text-white mt-0.5">{formatCurrency(monthExpense)}</p>
          </div>
        </div>

        {/* Net Savings */}
        <div className="glass-card rounded-3xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-indigo-550 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tích lũy ròng</p>
            <p className={`text-lg font-bold mt-0.5 ${netSavings >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-650 dark:text-rose-450'}`}>
              {formatCurrency(netSavings)}
            </p>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="glass-card rounded-3xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5 text-purple-555 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tỷ lệ tích lũy</p>
            <p className="text-lg font-bold text-slate-850 dark:text-white mt-0.5">
              {netSavings >= 0 ? `${savingsRate.toFixed(1)}%` : '0% (Âm)'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <ReportsCharts 
        monthlyTrendData={monthlyTrendData} 
        dailyData={dailyData} 
        selectedMonthYear={selectedMonthYear} 
      />
    </div>
  )
}
