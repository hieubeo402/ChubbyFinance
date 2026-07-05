'use client'

import React, { useState, useTransition, useActionState, useEffect } from 'react'
import { addTransactionAction, deleteTransactionAction } from './actions'
import { formatCurrency, formatDate } from '@/lib/utils'
import { 
  Plus, 
  Trash2, 
  Search, 
  SlidersHorizontal, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Info,
  Calendar,
  Loader2
} from 'lucide-react'

const EXPENSE_CATEGORIES = ['Ăn uống', 'Di chuyển', 'Mua sắm', 'Giải trí', 'Hóa đơn', 'Y tế', 'Khác']
const INCOME_CATEGORIES = ['Lương', 'Thưởng', 'Kinh doanh', 'Đầu tư', 'Khác']

interface Transaction {
  id: string
  amount: number
  type: string
  category: string
  description: string | null
  date: string
  created_at: string
}

export default function TransactionsClient({ initialTransactions }: { initialTransactions: Transaction[] }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isPendingDelete, startDeleteTransition] = useTransition()

  // Form states
  const [formType, setFormType] = useState('expense')
  const [formCategory, setFormCategory] = useState(EXPENSE_CATEGORIES[0])
  const [amountInput, setAmountInput] = useState('')
  const [rawAmount, setRawAmount] = useState('')

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cleanValue = value.replace(/\D/g, '')
    setRawAmount(cleanValue)
    setAmountInput(cleanValue ? Number(cleanValue).toLocaleString('en-US') : '')
  }


  // Filter states
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Add transaction action state
  const [state, formAction, isPendingAdd] = useActionState(addTransactionAction, null)

  // Update categories when type changes in form
  useEffect(() => {
    if (formType === 'expense') {
      setFormCategory(EXPENSE_CATEGORIES[0])
    } else {
      setFormCategory(INCOME_CATEGORIES[0])
    }
  }, [formType])

  // Keep list updated with props
  useEffect(() => {
    setTransactions(initialTransactions)
  }, [initialTransactions])

  // Close modal on success
  useEffect(() => {
    if (state?.success) {
      setShowAddModal(false)
      // Reset form variables
      setFormType('expense')
      setFormCategory(EXPENSE_CATEGORIES[0])
      setAmountInput('')
      setRawAmount('')
    }
  }, [state])

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory
    const matchesSearch = !searchTerm || 
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStartDate = !startDate || t.date >= startDate
    const matchesEndDate = !endDate || t.date <= endDate

    return matchesType && matchesCategory && matchesSearch && matchesStartDate && matchesEndDate
  })

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
      startDeleteTransition(async () => {
        const res = await deleteTransactionAction(id)
        if (res.error) {
          alert(res.error)
        }
      })
    }
  }

  // Get active categories list for filtering
  const allCategories = Array.from(
    new Set(transactions.map((t) => t.category))
  )

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 animate-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            <span className="text-gradient">Quản lý giao dịch</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Lịch sử thu nhập, lương thưởng và chi tiêu chi tiết</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-indigo-600/10 active:scale-[0.96] transition-all cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm giao dịch mới
        </button>
      </div>

      {/* Filters Card */}
      <div className="glass-card rounded-3xl p-6 space-y-4 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Bộ lọc tìm kiếm</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search bar */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Tìm theo ghi chú hoặc danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Type filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl py-2.5 px-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="all">Tất cả các loại</option>
              <option value="income">Thu nhập (Income)</option>
              <option value="expense">Chi tiêu (Expense)</option>
            </select>
          </div>

          {/* Category filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl py-2.5 px-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="all">Tất cả danh mục</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <input
              type="date"
              value={startDate}
              placeholder="Từ ngày"
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl py-2.5 px-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            />
          </div>
        </div>

        {/* Date end and Clear buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/40">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Đến ngày:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl py-1.5 px-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            />
          </div>

          {(filterType !== 'all' || filterCategory !== 'all' || startDate || endDate || searchTerm) && (
            <button
              onClick={() => {
                setFilterType('all')
                setFilterCategory('all')
                setStartDate('')
                setEndDate('')
                setSearchTerm('')
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Xóa tất cả bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-sm dark:shadow-none">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Không tìm thấy giao dịch nào</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Hãy thử thay đổi bộ lọc hoặc thêm giao dịch mới</p>
          </div>
        ) : (
          <>
            {/* === MOBILE: Card list (shown on small screens) === */}
            <div className="md:hidden divide-y divide-zinc-200/50 dark:divide-zinc-800/40">
              {filteredTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      t.type === 'income' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                    }`}>
                      {t.type === 'income'
                        ? <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        : <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-450" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                        {t.description || t.category}
                      </p>
                      <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">
                        {t.category} &bull; {formatDate(t.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className={`text-sm font-bold ${
                      t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-450'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(Number(t.amount))}
                    </span>
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={isPendingDelete}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* === DESKTOP: Table (hidden on mobile) === */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200/60 dark:border-zinc-800/80 bg-white/20 dark:bg-black/20 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <th className="p-4 pl-6">Ngày</th>
                    <th className="p-4">Loại</th>
                    <th className="p-4">Danh mục</th>
                    <th className="p-4">Ghi chú</th>
                    <th className="p-4 text-right">Số tiền</th>
                    <th className="p-4 pr-6 text-center w-20">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/40 text-sm">
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors group">
                      <td className="p-4 pl-6 text-slate-600 dark:text-slate-300 font-medium">{formatDate(t.date)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          t.type === 'income' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-450'
                        }`}>
                          {t.type === 'income' ? (
                            <><TrendingUp className="w-3 h-3" />Thu nhập</>
                          ) : (
                            <><TrendingDown className="w-3 h-3" />Chi tiêu</>
                          )}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-850 dark:text-white">{t.category}</td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{t.description || '-'}</td>
                      <td className={`p-4 text-right font-bold text-base ${
                        t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-450'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <button
                          onClick={() => handleDelete(t.id)}
                          disabled={isPendingDelete}
                          className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer disabled:opacity-30"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 w-full sm:max-w-lg relative z-10 shadow-2xl text-left max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Thêm giao dịch mới</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-slate-400 hover:text-slate-650 dark:hover:text-white p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={formAction} className="space-y-3">
              {state?.error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-650 dark:text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2.5">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              {/* Transaction Type selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormType('expense')}
                  className={`py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    formType === 'expense'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-450 font-bold'
                      : 'bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200/50 dark:border-zinc-800/80 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  Chi tiêu (Expense)
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('income')}
                  className={`py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    formType === 'income'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200/50 dark:border-zinc-800/80 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Thu nhập (Income)
                </button>
              </div>
              <input type="hidden" name="type" value={formType} />

              <div className="grid grid-cols-2 gap-3">
                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-550 dark:text-slate-400" htmlFor="amount-display">
                    Số tiền (VND) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="amount-display"
                    type="text"
                    value={amountInput}
                    onChange={handleAmountChange}
                    placeholder="Ví dụ: 100,000"
                    required
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <input type="hidden" name="amount" value={rawAmount} />
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400" htmlFor="date">
                    Ngày giao dịch <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400" htmlFor="category">
                  Danh mục <span className="text-rose-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  {formType === 'expense'
                    ? EXPENSE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))
                    : INCOME_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400" htmlFor="description">
                  Ghi chú chi tiết (Không bắt buộc)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  placeholder="Ví dụ: Ăn trưa với đồng nghiệp, Nhận lương tháng 7"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 btn-glass font-semibold py-2.5 rounded-xl text-sm cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isPendingAdd}
                  className="flex-1 bg-indigo-650 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl text-sm shadow-md shadow-indigo-600/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-[0.96]"
                >
                  {isPendingAdd ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu giao dịch'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
