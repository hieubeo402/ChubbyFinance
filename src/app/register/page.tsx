'use client'

import React, { useActionState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUpAction } from '../auth-actions'
import { Wallet, KeyRound, User, Loader2, Info, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, null)
  const router = useRouter()

  // Redirect to login if signup is successful
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push('/login')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [state, router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black p-4 relative overflow-hidden">
      {/* Decorative blurred circles for rich aesthetic */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Logo and Brand Name */}
        <div className="flex flex-col items-center mb-8">
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
          
          <h2 className="text-xl font-semibold text-white mb-6">Đăng ký tài khoản mới</h2>

          {state?.success ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-6 rounded-2xl flex flex-col items-center text-center space-y-3 animate-scale-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
              <h3 className="font-bold text-white">Đăng ký thành công!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tài khoản của bạn đã được khởi tạo. Đang chuyển hướng bạn sang trang đăng nhập trong giây lát...
              </p>
              <Link 
                href="/login" 
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Nhấp vào đây nếu không tự động chuyển hướng
              </Link>
            </div>
          ) : (
            <form action={formAction} className="space-y-5">
              {state?.error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2.5 animate-shake">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400" htmlFor="username">
                  Tên tài khoản (Username)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Nhập tên tài khoản (ví dụ: hieubong)"
                    required
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400" htmlFor="password">
                  Mật khẩu
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Tối thiểu 6 ký tự"
                    required
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400" htmlFor="confirmPassword">
                  Nhập lại mật khẩu
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Xác nhận lại mật khẩu"
                    required
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang đăng ký...
                  </>
                ) : (
                  'Đăng ký tài khoản'
                )}
              </button>
            </form>
          )}

          {!state?.success && (
            <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
              <span className="text-xs text-slate-400">Đã có tài khoản? </span>
              <Link
                href="/login"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
