'use client'

import React, { useState, useEffect } from 'react'
import { formatCurrency, getMonthYearString, formatDate } from '@/lib/utils'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
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
  const getLast6MonthsData = () => {
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
  }

  const monthlyTrendData = getLast6MonthsData()

  // 3. Prepare Daily Data for Selected Month
  const getDailyData = (selectedMY: string) => {
    const [mStr, yStr] = selectedMY.split('-')
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
  }

  const dailyData = getDailyData(selectedMonthYear)

  // 4. Calculate Stats for Selected Month
  const activeTransactions = transactions.filter(t => getMonthYearString(t.date) === selectedMonthYear)
  const monthIncome = activeTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
  const monthExpense = activeTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
  const netSavings = monthIncome - monthExpense
  const savingsRate = monthIncome > 0 ? (netSavings / monthIncome) * 100 : 0

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Báo cáo & Phân tích</h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm mt-1">Xu hướng tài chính và biểu đồ tương quan thu chi</p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 shadow-sm dark:shadow-none">
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
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
            <ArrowUpCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tổng thu tháng này</p>
            <p className="text-lg font-bold text-slate-805 dark:text-white mt-0.5">{formatCurrency(monthIncome)}</p>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
          <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center shrink-0">
            <ArrowDownCircle className="w-5 h-5 text-rose-550 dark:text-rose-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tổng chi tháng này</p>
            <p className="text-lg font-bold text-slate-805 dark:text-white mt-0.5">{formatCurrency(monthExpense)}</p>
          </div>
        </div>

        {/* Net Savings */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-indigo-550 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tích lũy ròng</p>
            <p className={`text-lg font-bold mt-0.5 ${netSavings >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-650 dark:text-rose-400'}`}>
              {formatCurrency(netSavings)}
            </p>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5 text-purple-550 dark:text-purple-400" />
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: 6-Month Comparison (Bar Chart) */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">So sánh Thu nhập vs Chi tiêu (6 Tháng qua)</h3>
          </div>

          {mounted ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ 
                      backgroundColor: 'var(--color-card)', 
                      borderColor: 'var(--color-border)', 
                      borderRadius: '12px',
                      color: 'var(--color-foreground)'
                    }}
                    labelStyle={{ color: 'var(--color-foreground)', fontWeight: 'bold' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Thu nhập" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Chi tiêu" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-150 dark:border-zinc-800/20 rounded-2xl animate-pulse">
              <span className="text-xs text-slate-400 dark:text-slate-500">Đang chuẩn bị biểu đồ...</span>
            </div>
          )}
        </div>

        {/* Chart 2: Daily Transaction Flow for Selected Month (Area Chart) */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-2">
            <LineIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Dòng chảy tiền tệ hàng ngày (Tháng {selectedMonthYear})</h3>
          </div>

          {mounted ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ 
                      backgroundColor: 'var(--color-card)', 
                      borderColor: 'var(--color-border)', 
                      borderRadius: '12px',
                      color: 'var(--color-foreground)'
                    }}
                    labelStyle={{ color: 'var(--color-foreground)', fontWeight: 'bold' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="Thu nhập" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#incomeGrad)" />
                  <Area type="monotone" dataKey="Chi tiêu" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-150 dark:border-zinc-800/20 rounded-2xl animate-pulse">
              <span className="text-xs text-slate-400 dark:text-slate-500">Đang chuẩn bị biểu đồ...</span>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
