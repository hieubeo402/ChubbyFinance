'use client'

import React, { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUpAction } from '../auth-actions'
import { PiggyBank, KeyRound, User, Loader2, Info, CheckCircle2, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, null)
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
    <main className="min-h-screen flex items-center justify-center bg-[#FFF5F7] p-4 relative overflow-hidden selection:bg-[#ec4899]/10 selection:text-[#ec4899]">
      {/* Decorative blurred circles for rich aesthetic */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ec4899]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f43f5e]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm z-10">
        {/* Logo and Brand Name */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="w-16 h-16 bg-[#ec4899] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ec4899]/20 mb-3 hover:scale-110 hover:rotate-6 transition-transform duration-300">
            <PiggyBank className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
            ChubbyFinance <span className="animate-bounce">🐷</span>
          </h1>
          <p className="text-xs text-rose-500 font-bold tracking-wide uppercase mt-2">Nuôi heo đất & Quản lý chi tiêu cute</p>
        </div>

        {/* Card container */}
        <div className="bg-white border border-rose-100 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-[#ec4899]" />
          
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">Đăng ký tài khoản mới</h2>

          {state?.success ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-sm p-6 rounded-2xl flex flex-col items-center text-center space-y-3 animate-scale-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
              <h3 className="font-extrabold text-slate-900">Đăng ký thành công!</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Tài khoản của bạn đã được khởi tạo. Đang chuyển hướng bạn sang trang đăng nhập trong giây lát...
              </p>
              <Link 
                href="/login" 
                className="text-xs text-[#ec4899] hover:text-[#be185d] underline font-extrabold"
              >
                Nhấp vào đây nếu không tự động chuyển hướng
              </Link>
            </div>
          ) : (
            <form action={formAction} className="space-y-5">
              {state?.error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs px-4 py-3 rounded-xl flex items-center gap-2.5 animate-shake font-bold">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="username">
                  Tên tài khoản (Username)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#ec4899]" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Nhập tên tài khoản (ví dụ: hieubong)"
                    required
                    className="w-full bg-white border border-[#F3F4F6] rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-2 focus:ring-[#ec4899]/10 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="password">
                  Mật khẩu
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#ec4899]" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tối thiểu 6 ký tự"
                    required
                    className="w-full bg-white border border-[#F3F4F6] rounded-xl py-3 pl-11 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-2 focus:ring-[#ec4899]/10 transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-[#ec4899] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="confirmPassword">
                  Nhập lại mật khẩu
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#ec4899]" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Xác nhận lại mật khẩu"
                    required
                    className="w-full bg-white border border-[#F3F4F6] rounded-xl py-3 pl-11 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-2 focus:ring-[#ec4899]/10 transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-[#ec4899] transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full btn-pink-glass font-extrabold py-3 px-4 rounded-xl active:scale-[0.96] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-550 font-medium">Đã có tài khoản? </span>
              <Link
                href="/login"
                className="text-xs text-[#ec4899] hover:text-[#be185d] font-extrabold transition-colors"
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
