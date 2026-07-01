'use client'

import React, { useActionState, useState } from 'react'
import Link from 'next/link'
import { signInAction } from '../auth-actions'
import { Wallet, KeyRound, User, Loader2, Info } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signInAction, null)
  const [showForgotModal, setShowForgotModal] = useState(false)

  return (
    <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black p-4 relative overflow-hidden">
      {/* Decorative blurred circles for rich aesthetic */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Logo and Brand Name */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3 hover:scale-105 transition-transform duration-300">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-200 tracking-tight">
            ChubbyFinance
          </h1>
          <p className="text-sm text-slate-400 mt-2">Quản lý tài chính cá nhân thông minh & tối giản</p>
        </div>

        {/* Card container */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
          
          <h2 className="text-xl font-semibold text-white mb-6">Đăng nhập tài khoản</h2>

          <form action={formAction} className="space-y-5">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2.5 animate-shake">
                <Info className="w-4 h-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400" htmlFor="username">
                Tên tài khoản
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Nhập tài khoản của bạn"
                  required
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400" htmlFor="password">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  required
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
            <span className="text-xs text-slate-400">Chưa có tài khoản? </span>
            <Link
              href="/register"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowForgotModal(false)}
          />
          {/* Modal content */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl animate-scale-in">
            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
              <Info className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Thông báo cấp lại mật khẩu</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Vui lòng liên hệ với quản trị viên <span className="font-semibold text-amber-400">HieuChubby</span> để được hỗ trợ cấp lại mật khẩu.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
