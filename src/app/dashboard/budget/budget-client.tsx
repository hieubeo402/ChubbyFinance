'use client'

import React, { useState, useActionState, useEffect } from 'react'
import { saveBudgetAction } from './actions'
import { formatCurrency, getMonthYearString } from '@/lib/utils'
import { 
  PiggyBank, 
  Wallet, 
  TrendingDown, 
  AlertTriangle, 
  Edit3, 
  Calendar, 
  Info,
  Loader2,
  CheckCircle2,
  PieChart as PieIcon
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface Budget {
  id: string
  month_year: string
  fixed_income: number
  monthly_budget: number
}

interface Transaction {
  id: string
  amount: number
  type: string
  category: string
  description: string | null
  date: string
}

// Curated colors for categories
const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#eab308', '#a855f7', '#06b6d4', '#f97316', '#8b5cf6']

export default function BudgetClient({ 
  initialBudgets, 
  transactions 
}: { 
  initialBudgets: Budget[]
  transactions: Transaction[] 
}) {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets)
  const [mounted, setMounted] = useState(false)

  // Get current Month-Year
  const now = new Date()
  const currentMonthYear = getMonthYearString(now) // e.g. "07-2026"
  
  const [selectedMonthYear, setSelectedMonthYear] = useState(currentMonthYear)
  const [isEditing, setIsEditing] = useState(false)

  // Action State
  const [state, formAction, isPending] = useActionState(saveBudgetAction, null)

  // Mounting check to prevent hydration mismatch for Recharts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Keep budgets updated
  useEffect(() => {
    setBudgets(initialBudgets)
  }, [initialBudgets])

  // Exit edit mode on success
  useEffect(() => {
    if (state?.success) {
      setIsEditing(false)
    }
  }, [state])

  // Get current budget for selected month
  const activeBudget = budgets.find((b) => b.month_year === selectedMonthYear)

  // Filter transactions of selected month-year
  const monthTransactions = transactions.filter((t) => {
    return getMonthYearString(t.date) === selectedMonthYear
  })

  // Calculate total expenses for the selected month
  const totalExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  // Group expenses by category
  const categoryExpenses = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const amt = Number(t.amount)
      acc[t.category] = (acc[t.category] || 0) + amt
      return acc
    }, {} as Record<string, number>)

  // Convert to array format for Recharts
  const chartData = Object.entries(categoryExpenses).map(([name, value]) => ({
    name,
    value
  }))

  const budgetLimit = activeBudget ? Number(activeBudget.monthly_budget) : 0
  const fixedIncome = activeBudget ? Number(activeBudget.fixed_income) : 0
  const remainingBudget = budgetLimit - totalExpense
  const progressPercent = budgetLimit > 0 ? (totalExpense / budgetLimit) * 100 : 0
  
  const isWarning = budgetLimit > 0 && progressPercent >= 85

  // Generate month options for the dropdown (previous 6 months + next 3 months)
  const monthOptions: string[] = []
  for (let i = -6; i <= 3; i++) {
    const d = new Date()
    d.setMonth(now.getMonth() + i)
    const option = getMonthYearString(d)
    if (!monthOptions.includes(option)) {
      monthOptions.push(option)
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-page">
      {/* Header with Selector */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Ngân sách & Hạn mức</h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm mt-1">Quản lý hạn mức chi tiêu hàng tháng và phân tích cơ cấu chi tiêu</p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 shadow-sm dark:shadow-none">
          <Calendar className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Chọn Tháng:</span>
          <select
            value={selectedMonthYear}
            onChange={(e) => {
              setSelectedMonthYear(e.target.value)
              setIsEditing(false)
            }}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Area: Settings and Progress (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Indicators */}
          {activeBudget && isWarning && (
            <div className={`border p-4 rounded-2xl flex items-start gap-3.5 animate-pulse ${
              progressPercent > 100 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
            }`}>
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">
                  {progressPercent > 100 ? 'Vượt quá hạn mức!' : 'Chú ý: Sắp chi tiêu vượt quá ngân sách tháng này!'}
                </h4>
                <p className="text-xs mt-1 leading-relaxed opacity-90">
                  {progressPercent > 100 
                    ? `Bạn đã chi ${formatCurrency(totalExpense)}, vượt quá ${formatCurrency(Math.abs(remainingBudget))} so với ngân sách hạn định!`
                    : `Tổng chi tiêu của bạn đã chạm mức ${progressPercent.toFixed(1)}% của ngân sách tháng. Hãy cẩn trọng!`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Budget Setting / Edit Card */}
          <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm dark:shadow-none">
            {!activeBudget || isEditing ? (
              <form action={formAction} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                  {activeBudget ? `Sửa ngân sách Tháng ${selectedMonthYear}` : `Thiết lập ngân sách Tháng ${selectedMonthYear}`}
                </h3>

                {state?.error && (
                  <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}

                <input type="hidden" name="month_year" value={selectedMonthYear} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fixed Income */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400" htmlFor="fixed_income">
                      Nguồn thu nhập cố định hàng tháng (VND) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="fixed_income"
                      name="fixed_income"
                      type="number"
                      min="0"
                      required
                      defaultValue={activeBudget ? Number(activeBudget.fixed_income) : ''}
                      placeholder="Ví dụ: 15000000"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* Monthly Budget limit */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400" htmlFor="monthly_budget">
                      Hạn mức chi tiêu tối đa (VND) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="monthly_budget"
                      name="monthly_budget"
                      type="number"
                      min="1"
                      required
                      defaultValue={activeBudget ? Number(activeBudget.monthly_budget) : ''}
                      placeholder="Ví dụ: 10000000"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  {activeBudget && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 btn-glass font-semibold py-2.5 rounded-xl text-sm cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lưu cài đặt'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Chỉ số tài chính tháng</h3>
                    <p className="text-xs text-slate-500">Hạn mức và thu nhập cố định đang áp dụng</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Thay đổi hạn mức
                  </button>
                </div>

                {/* Financial Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/85 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Wallet className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Thu nhập cố định</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white mt-0.5">{formatCurrency(fixedIncome)}</p>
                    </div>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/85 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <PiggyBank className="w-5 h-5 text-purple-550 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Hạn mức chi tiêu</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white mt-0.5">{formatCurrency(budgetLimit)}</p>
                    </div>
                  </div>
                </div>

                {/* Budget Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-end text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Tiến trình tiêu dùng</span>
                    <span className="font-bold text-slate-750 dark:text-slate-200">
                      {formatCurrency(totalExpense)} / {formatCurrency(budgetLimit)} ({progressPercent.toFixed(1)}%)
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full bg-zinc-100 dark:bg-zinc-950 rounded-full h-3.5 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        progressPercent > 100 
                          ? 'bg-rose-500 shadow-md shadow-rose-500/20' 
                          : progressPercent >= 85 
                          ? 'bg-amber-500 shadow-md shadow-amber-500/20' 
                          : 'bg-emerald-500 shadow-md shadow-emerald-500/20'
                      }`}
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                    <span>Đã tiêu: {progressPercent.toFixed(0)}%</span>
                    <span>
                      {remainingBudget >= 0 
                        ? `Còn lại khả dụng: ${formatCurrency(remainingBudget)}` 
                        : `Vượt hạn mức: ${formatCurrency(Math.abs(remainingBudget))}`
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick info if budget is not set */}
          {!activeBudget && !isEditing && (
            <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-8 text-center space-y-4 shadow-sm dark:shadow-none">
              <PiggyBank className="w-12 h-12 text-slate-450 dark:text-slate-650 mx-auto" />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">Chưa thiết lập ngân sách tháng {selectedMonthYear}</h4>
                <p className="text-sm text-slate-550 dark:text-slate-500 mt-1 max-w-md mx-auto">
                  Hãy thiết lập nguồn thu nhập cố định và ngân sách chi tiêu tối đa để hệ thống ChubbyFinance phân tích và bảo vệ dòng tiền của bạn.
                </p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-indigo-600/10"
              >
                Cài đặt ngay
              </button>
            </div>
          )}
        </div>

        {/* Right Area: Category Breakdown (1 Column) */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between shadow-sm dark:shadow-none">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Cơ cấu chi tiêu</h3>
            <p className="text-xs text-slate-550 dark:text-slate-500 mb-6">Tỷ lệ phân phối chi tiêu theo danh mục</p>

            {chartData.length === 0 ? (
              <div className="text-center py-16">
                <PieIcon className="w-10 h-10 text-slate-400 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-medium">Chưa có giao dịch chi tiêu nào</p>
                <p className="text-xs text-slate-450 dark:text-slate-650 mt-0.5">Các khoản chi tiêu trong tháng sẽ xuất hiện tại đây</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Recharts Donut Pie Chart */}
                {mounted ? (
                  <div className="h-44 w-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                           data={chartData}
                           cx="50%"
                           cy="50%"
                           innerRadius={50}
                           outerRadius={75}
                           paddingAngle={3}
                           dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => formatCurrency(Number(value))}
                          contentStyle={{ 
                            backgroundColor: 'var(--color-card)', 
                            borderColor: 'var(--color-border)', 
                            borderRadius: '12px',
                            color: 'var(--color-foreground)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center pointer-events-none">
                      <span className="text-base font-extrabold text-slate-800 dark:text-white">{formatCurrency(totalExpense)}</span>
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Tổng chi tiêu</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-44 w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-150 dark:border-zinc-800/20 rounded-2xl animate-pulse">
                    <span className="text-xs text-slate-400 dark:text-slate-500">Đang chuẩn bị biểu đồ...</span>
                  </div>
                )}

                {/* Categories Table list with progress lines */}
                <div className="space-y-3 pt-2">
                  {chartData.map((item, idx) => {
                    const percent = (item.value / totalExpense) * 100
                    const color = COLORS[idx % COLORS.length]
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                            <span className="font-semibold text-slate-800 dark:text-white">{item.name}</span>
                          </div>
                          <span className="text-slate-500 dark:text-slate-400">
                            {formatCurrency(item.value)} ({percent.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-950 rounded-full h-1 overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${percent}%`,
                              backgroundColor: color 
                            }} 
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
