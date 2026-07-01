'use client'

import React, { useState, useEffect, useActionState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction, changePasswordAction } from '@/app/auth-actions'
import { 
  Wallet, 
  LayoutDashboard, 
  ArrowLeftRight, 
  HandCoins, 
  PiggyBank, 
  BarChart3, 
  LogOut,
  Sun,
  Moon,
  User,
  KeyRound,
  X,
  Loader2,
  CheckCircle2,
  Settings
} from 'lucide-react'

export default function DashboardSidebar({ username }: { username: string }) {
  const pathname = usePathname()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  // Change password action state
  const [state, formAction, isPending] = useActionState(changePasswordAction, null)

  // Initialize theme from document class list
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    }
  }, [])

  // Handle modal success reset
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        setShowProfileModal(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [state])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }

  const menuItems = [
    {
      name: 'Tổng quan',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Giao dịch',
      href: '/dashboard/transactions',
      icon: ArrowLeftRight,
    },
    {
      name: 'Nợ & Cho vay',
      href: '/dashboard/debts-loans',
      icon: HandCoins,
    },
    {
      name: 'Ngân sách',
      href: '/dashboard/budget',
      icon: PiggyBank,
    },
    {
      name: 'Báo cáo',
      href: '/dashboard/reports',
      icon: BarChart3,
    },
  ]

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      {/* Upper part */}
      <div className="p-6">
        {/* Brand & Theme toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/10">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              ChubbyFinance
            </span>
          </div>

          {/* Theme Toggle Button using liquid glass styling */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-800 hover:bg-zinc-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Đổi giao diện Sáng/Tối"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Clickable User profile summary to trigger Change Password */}
        <div 
          onClick={() => setShowProfileModal(true)}
          className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 mb-6 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Tài khoản</p>
            <p className="text-sm font-semibold text-white truncate mt-0.5 group-hover:text-indigo-400 transition-colors">
              @{username}
            </p>
          </div>
          <Settings className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:rotate-45 transition-all duration-300" />
        </div>

        {/* Menu list */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 text-indigo-400 font-semibold'
                    : 'text-slate-400 hover:bg-zinc-900/50 hover:text-white border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-6 border-t border-zinc-900">
        <button
          onClick={async () => {
            await signOutAction()
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>

      {/* Profile & Change Password Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowProfileModal(false)}
          />
          {/* Modal content - Glassmorphic design */}
          <div className="bg-zinc-950/85 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl animate-scale-in text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                Cài đặt tài khoản
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {state?.success ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-6 rounded-2xl flex flex-col items-center text-center space-y-3 animate-scale-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                <h4 className="font-bold text-white">Thành công!</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mật khẩu của bạn đã được thay đổi thành công.
                </p>
              </div>
            ) : (
              <form action={formAction} className="space-y-4">
                <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-850 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Người dùng</span>
                  <p className="text-sm font-semibold text-white">@{username}</p>
                </div>

                {state?.error && (
                  <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                    <X className="w-4 h-4 shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}

                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="currentPassword">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                      className="w-full bg-zinc-950/60 border border-zinc-850 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="newPassword">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      placeholder="Tối thiểu 6 ký tự"
                      required
                      className="w-full bg-zinc-950/60 border border-zinc-850 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="confirmNewPassword">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type="password"
                      placeholder="Xác nhận lại mật khẩu mới"
                      required
                      className="w-full bg-zinc-950/60 border border-zinc-850 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Buttons using the premium .btn-glass style */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="flex-1 btn-glass hover:bg-white/10 dark:hover:bg-zinc-900/60 text-center font-semibold py-2.5 rounded-xl text-xs cursor-pointer transition-all border border-zinc-800/40"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 btn-glass text-center font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Đang đổi...
                      </>
                    ) : (
                      'Đổi mật khẩu'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}
