'use client'

import React, { useState, useTransition, useActionState, useEffect } from 'react'
import { addDebtLoanAction, deleteDebtLoanAction, addPaymentAction } from './actions'
import { formatCurrency, formatDate } from '@/lib/utils'
import { 
  Plus, 
  Trash2, 
  X, 
  Info,
  Calendar,
  Loader2,
  HandCoins,
  AlertTriangle,
  Clock,
  History,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface Payment {
  id: string
  debt_loan_id: string
  amount_paid: number
  paid_date: string
  note: string | null
  created_at: string
}

interface DebtLoan {
  id: string
  type: 'debt' | 'loan'
  partner_name: string
  total_amount: number
  remaining_amount: number
  due_date: string
  status: 'active' | 'paid'
  created_at: string
  debt_loan_history: Payment[]
}

export default function DebtsLoansClient({ initialData }: { initialData: DebtLoan[] }) {
  const [data, setData] = useState<DebtLoan[]>(initialData)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DebtLoan | null>(null)
  
  // State to track expanded history sections per card
  const [expandedHistories, setExpandedHistories] = useState<Record<string, boolean>>({})

  // Transitions
  const [isPendingDelete, startDeleteTransition] = useTransition()

  // Actions states
  const [addState, addFormAction, isPendingAdd] = useActionState(addDebtLoanAction, null)
  const [payState, payFormAction, isPendingPay] = useActionState(addPaymentAction, null)

  // Form currency formatting state
  const [totalAmountInput, setTotalAmountInput] = useState('')
  const [rawTotalAmount, setRawTotalAmount] = useState('')
  const [amountPaidInput, setAmountPaidInput] = useState('')
  const [rawAmountPaid, setRawAmountPaid] = useState('')

  const handleTotalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cleanValue = value.replace(/\D/g, '')
    setRawTotalAmount(cleanValue)
    setTotalAmountInput(cleanValue ? Number(cleanValue).toLocaleString('en-US') : '')
  }

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cleanValue = value.replace(/\D/g, '')
    setRawAmountPaid(cleanValue)
    setAmountPaidInput(cleanValue ? Number(cleanValue).toLocaleString('en-US') : '')
  }


  // Keep state updated
  useEffect(() => {
    setData(initialData)
  }, [initialData])

  // Close modals on success
  useEffect(() => {
    if (addState?.success) {
      setShowAddModal(false)
      setTotalAmountInput('')
      setRawTotalAmount('')
    }
  }, [addState])

  useEffect(() => {
    if (payState?.success) {
      setShowPayModal(false)
      setSelectedItem(null)
      setAmountPaidInput('')
      setRawAmountPaid('')
    }
  }, [payState])

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa khoản này? Việc này sẽ xóa toàn bộ lịch sử thanh toán liên quan.')) {
      startDeleteTransition(async () => {
        const res = await deleteDebtLoanAction(id)
        if (res.error) {
          alert(res.error)
        }
      })
    }
  }

  const toggleHistory = (id: string) => {
    setExpandedHistories(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Helpers to check due dates
  const todayStr = new Date().toISOString().split('T')[0]
  
  const getDueStatus = (dl: DebtLoan) => {
    if (dl.status === 'paid' || Number(dl.remaining_amount) <= 0) return null

    const today = new Date(todayStr)
    const dueDate = new Date(dl.due_date)
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { label: 'Quá hạn!', className: 'bg-rose-500/10 border-rose-500/30 text-rose-550 dark:text-rose-400 animate-pulse animate-duration-1000' }
    } else if (diffDays <= 3) {
      return { label: `Còn ${diffDays} ngày!`, className: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold' }
    }
    return null
  }

  // Filter lists
  const debts = data.filter((item) => item.type === 'debt')
  const loans = data.filter((item) => item.type === 'loan')

  // Render SVG progress ring/pie chart
  const renderPieChart = (dl: DebtLoan) => {
    const total = Number(dl.total_amount)
    const remaining = Number(dl.remaining_amount)
    const paid = total - remaining
    const paidPercent = total > 0 ? (paid / total) * 100 : 0

    // SVG parameters
    const r = 15
    const c = 2 * Math.PI * r
    const offset = c - (paidPercent / 100) * c
    const isDebt = dl.type === 'debt'

    return (
      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          {/* Background circle */}
          <circle
            cx="18"
            cy="18"
            r={r}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4.5"
            className="text-zinc-200/50 dark:text-zinc-800/80"
          />
          {/* Progress circle */}
          <circle
            cx="18"
            cy="18"
            r={r}
            fill="transparent"
            stroke={isDebt ? '#f43f5e' : '#10b981'} // Rose for debt, Emerald for loan
            strokeWidth="4.5"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-xs font-bold text-slate-800 dark:text-white">{paidPercent.toFixed(0)}%</span>
          <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider">Đã trả</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            <span className="text-gradient">Nợ & Cho vay</span>
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm mt-1">Quản lý, trả bớt và thu hồi các khoản nợ phải trả/phải đòi</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-indigo-600/10 active:scale-[0.96] transition-all cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4" />
          Tạo khoản mới
        </button>
      </div>

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Debts column */}
        <div className="space-y-6">
          <div className="bg-rose-500/[0.02] dark:bg-rose-500/[0.02] border border-rose-500/10 dark:border-rose-500/10 rounded-3xl p-6 relative overflow-hidden shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-lg font-bold text-rose-600 dark:text-rose-450 mb-4 flex items-center gap-2">
              <HandCoins className="w-5 h-5" />
              Khoản nợ cần trả (Debts)
            </h2>
            <div className="text-2xl font-bold text-slate-850 dark:text-white">
              {formatCurrency(debts.reduce((acc, curr) => acc + Number(curr.remaining_amount), 0))}
            </div>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-1">Tổng nợ gốc: {formatCurrency(debts.reduce((acc, curr) => acc + Number(curr.total_amount), 0))}</p>
          </div>

          {/* Debts List */}
          {debts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white/20 dark:bg-zinc-900/10">
              <p className="text-sm text-slate-450 dark:text-slate-500">Tuyệt vời, bạn không có khoản nợ nào!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {debts.map((item) => {
                const statusInfo = getDueStatus(item)
                const isPaid = item.status === 'paid'
                return (
                  <div 
                    key={item.id} 
                    className={`glass-card rounded-3xl p-6 transition-all relative overflow-hidden shadow-sm dark:shadow-none ${
                      isPaid ? 'opacity-60' : 'hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {/* Glowing status line */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${isPaid ? 'bg-zinc-400 dark:bg-zinc-700' : 'bg-rose-500'}`} />

                    <div className="flex gap-4 items-start pl-2">
                      {renderPieChart(item)}

                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-base text-slate-800 dark:text-white truncate">Nợ: {item.partner_name}</h3>
                          {statusInfo && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${statusInfo.className}`}>
                              {statusInfo.label}
                            </span>
                          )}
                          {isPaid && (
                            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 shrink-0 font-semibold">
                              Đã hoàn thành
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-slate-500">Còn lại</p>
                            <p className="font-bold text-slate-800 dark:text-white">{formatCurrency(item.remaining_amount)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Nợ gốc</p>
                            <p className="font-semibold text-slate-600 dark:text-slate-300">{formatCurrency(item.total_amount)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-1">
                          <Clock className="w-3 h-3" />
                          <span>Hạn thanh toán: {formatDate(item.due_date)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions and expand button */}
                    <div className="flex justify-between items-center mt-5 pt-4 border-t border-zinc-150 dark:border-zinc-800/40 pl-2">
                      <div className="flex gap-2">
                        {!isPaid && (
                          <button
                            onClick={() => {
                              setSelectedItem(item)
                              setShowPayModal(true)
                            }}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-450 border border-rose-500/20 text-xs font-semibold py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                          >
                            Trả bớt
                          </button>
                        )}
                        <button
                          onClick={() => toggleHistory(item.id)}
                          className="btn-glass text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <History className="w-3.5 h-3.5" />
                          {expandedHistories[item.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isPendingDelete}
                        className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer transition-colors disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Expanded Payment History List */}
                    {expandedHistories[item.id] && (
                      <div className="mt-4 pt-4 border-t border-zinc-150 dark:border-zinc-800/40 pl-2 space-y-2 animate-scale-in">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Lịch sử trả nợ</p>
                        {item.debt_loan_history.length === 0 ? (
                          <p className="text-xs text-slate-400 dark:text-slate-500 italic">Chưa có lượt trả nợ nào</p>
                        ) : (
                          <div className="space-y-2">
                            {item.debt_loan_history.map((hist) => (
                              <div key={hist.id} className="flex justify-between items-center text-xs bg-white/40 dark:bg-black/35 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/40">
                                <div>
                                  <p className="font-semibold text-slate-700 dark:text-slate-300">{formatDate(hist.paid_date)}</p>
                                  {hist.note && <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">{hist.note}</p>}
                                </div>
                                <span className="font-bold text-rose-650 dark:text-rose-400">-{formatCurrency(hist.amount_paid)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Loans column */}
        <div className="space-y-6">
          <div className="bg-emerald-500/[0.02] dark:bg-emerald-500/[0.02] border border-emerald-500/10 dark:border-emerald-500/10 rounded-3xl p-6 relative overflow-hidden shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-lg font-bold text-emerald-605 dark:text-emerald-400 mb-4 flex items-center gap-2">
              <HandCoins className="w-5 h-5" />
              Khoản cho vay cần đòi (Loans)
            </h2>
            <div className="text-2xl font-bold text-slate-850 dark:text-white">
              {formatCurrency(loans.reduce((acc, curr) => acc + Number(curr.remaining_amount), 0))}
            </div>
            <p className="text-xs text-slate-555 dark:text-slate-400 mt-1">Tổng tiền cho vay: {formatCurrency(loans.reduce((acc, curr) => acc + Number(curr.total_amount), 0))}</p>
          </div>

          {/* Loans List */}
          {loans.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white/20 dark:bg-zinc-900/10">
              <p className="text-sm text-slate-450 dark:text-slate-500">Bạn chưa cho ai vay tiền.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((item) => {
                const statusInfo = getDueStatus(item)
                const isPaid = item.status === 'paid'
                return (
                  <div 
                    key={item.id} 
                    className={`glass-card rounded-3xl p-6 transition-all relative overflow-hidden shadow-sm dark:shadow-none ${
                      isPaid ? 'opacity-60' : 'hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {/* Glowing status line */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${isPaid ? 'bg-zinc-400 dark:bg-zinc-700' : 'bg-emerald-500'}`} />

                    <div className="flex gap-4 items-start pl-2">
                      {renderPieChart(item)}

                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-base text-slate-800 dark:text-white truncate">Cho vay: {item.partner_name}</h3>
                          {statusInfo && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${statusInfo.className}`}>
                              {statusInfo.label}
                            </span>
                          )}
                          {isPaid && (
                            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 shrink-0 font-semibold">
                              Đã thu hồi hết
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-slate-500">Còn lại</p>
                            <p className="font-bold text-slate-800 dark:text-white">{formatCurrency(item.remaining_amount)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Gốc cho vay</p>
                            <p className="font-semibold text-slate-600 dark:text-slate-300">{formatCurrency(item.total_amount)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-1">
                          <Clock className="w-3 h-3" />
                          <span>Hạn thu hồi: {formatDate(item.due_date)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions and expand button */}
                    <div className="flex justify-between items-center mt-5 pt-4 border-t border-zinc-150 dark:border-zinc-800/40 pl-2">
                      <div className="flex gap-2">
                        {!isPaid && (
                          <button
                            onClick={() => {
                              setSelectedItem(item)
                              setShowPayModal(true)
                            }}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-655 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                          >
                            Thu hồi bớt
                          </button>
                        )}
                        <button
                          onClick={() => toggleHistory(item.id)}
                          className="btn-glass text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <History className="w-3.5 h-3.5" />
                          {expandedHistories[item.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isPendingDelete}
                        className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer transition-colors disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Expanded Payment History List */}
                    {expandedHistories[item.id] && (
                      <div className="mt-4 pt-4 border-t border-zinc-150 dark:border-zinc-800/40 pl-2 space-y-2 animate-scale-in">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Lịch sử thu hồi</p>
                        {item.debt_loan_history.length === 0 ? (
                          <p className="text-xs text-slate-450 dark:text-slate-500 italic">Chưa có lượt thu hồi nào</p>
                        ) : (
                          <div className="space-y-2">
                            {item.debt_loan_history.map((hist) => (
                              <div key={hist.id} className="flex justify-between items-center text-xs bg-white/40 dark:bg-black/35 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/40">
                                <div>
                                  <p className="font-semibold text-slate-700 dark:text-slate-300">{formatDate(hist.paid_date)}</p>
                                  {hist.note && <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">{hist.note}</p>}
                                </div>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(hist.amount_paid)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Debt/Loan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="glass-card rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-md relative z-10 shadow-2xl text-left max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Tạo khoản nợ / cho vay mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-450 hover:text-slate-655 dark:hover:text-white p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={addFormAction} className="space-y-4">
              {addState?.error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-650 dark:text-rose-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{addState.error}</span>
                </div>
              )}

              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-550 dark:text-slate-400">Loại khoản nợ/cho vay</label>
                <select
                  name="type"
                  required
                  className="w-full bg-zinc-100/40 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="debt">Nợ cần trả (Mình nợ người ta)</option>
                  <option value="loan">Cho vay cần đòi (Người ta nợ mình)</option>
                </select>
              </div>

              {/* Partner Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-550 dark:text-slate-400" htmlFor="partner_name">
                  Tên người nợ / người cho vay <span className="text-rose-500">*</span>
                </label>
                <input
                  id="partner_name"
                  name="partner_name"
                  type="text"
                  placeholder="Ví dụ: Anh Ba, Ngân hàng ACB..."
                  required
                  className="w-full bg-zinc-100/40 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Total Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-555 dark:text-slate-400" htmlFor="total_amount">
                  Tổng số tiền gốc <span className="text-rose-500">*</span>
                </label>
                <input
                  id="total_amount-display"
                  type="text"
                  value={totalAmountInput}
                  onChange={handleTotalAmountChange}
                  placeholder="Ví dụ: 5,000,000"
                  required
                  className="w-full bg-zinc-100/40 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-indigo-500"
                />
                <input type="hidden" name="total_amount" value={rawTotalAmount} />
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-555 dark:text-slate-400" htmlFor="due_date">
                  Hạn chót thanh toán <span className="text-rose-500">*</span>
                </label>
                <input
                  id="due_date"
                  name="due_date"
                  type="date"
                  required
                  defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Default 7 days from now
                  className="w-full bg-zinc-100/40 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 btn-glass font-semibold py-2.5 rounded-xl text-sm cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPendingAdd}
                  className="flex-1 bg-indigo-650 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-[0.96]"
                >
                  {isPendingAdd ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tạo khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay/Recover Payment Modal */}
      {showPayModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
            setShowPayModal(false)
            setSelectedItem(null)
          }} />
          <div className="glass-card rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-md relative z-10 shadow-2xl text-left max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {selectedItem.type === 'debt' ? 'Trả bớt nợ' : 'Thu hồi bớt nợ'}
              </h3>
              <button 
                onClick={() => {
                  setShowPayModal(false)
                  setSelectedItem(null)
                }} 
                className="text-slate-450 hover:text-slate-655 dark:hover:text-white p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={payFormAction} className="space-y-4">
              {payState?.error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-655 dark:text-rose-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{payState.error}</span>
                </div>
              )}

              <input type="hidden" name="debt_loan_id" value={selectedItem.id} />

              <div className="bg-zinc-100/40 dark:bg-zinc-950/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 mb-2 space-y-1">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Đối tác</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedItem.partner_name}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold pt-1">Số dư còn lại</p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(selectedItem.remaining_amount)}</p>
              </div>

              {/* Amount paid */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-555 dark:text-slate-400" htmlFor="amount_paid">
                  Số tiền thanh toán <span className="text-rose-500">*</span>
                </label>
                <input
                  id="amount_paid-display"
                  type="text"
                  value={amountPaidInput}
                  onChange={handleAmountPaidChange}
                  placeholder={`Ví dụ: ${selectedItem.remaining_amount.toLocaleString('en-US')}`}
                  required
                  className="w-full bg-zinc-100/40 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                />
                <input type="hidden" name="amount_paid" value={rawAmountPaid} />
              </div>

              {/* Paid date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-555 dark:text-slate-400" htmlFor="paid_date">
                  Ngày thanh toán <span className="text-rose-500">*</span>
                </label>
                <input
                  id="paid_date"
                  name="paid_date"
                  type="date"
                  required
                  defaultValue={todayStr}
                  className="w-full bg-zinc-100/40 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                />
              </div>

              {/* Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-555 dark:text-slate-400" htmlFor="note">
                  Ghi chú
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={2}
                  placeholder="Ví dụ: Trả đợt 1, đòi được một ít..."
                  className="w-full bg-zinc-100/40 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPayModal(false)
                    setSelectedItem(null)
                  }}
                  className="flex-1 btn-glass font-semibold py-2.5 rounded-xl text-sm cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPendingPay}
                  className="flex-1 bg-indigo-650 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-[0.96]"
                >
                  {isPendingPay ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Xác nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
