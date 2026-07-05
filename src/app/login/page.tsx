'use client'

import React, { useActionState, useState } from 'react'
import Link from 'next/link'
import { signInAction } from '../auth-actions'
import { PiggyBank, KeyRound, User, Loader2, Info, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signInAction, null)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
          
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">Đăng nhập tài khoản</h2>

          <form action={formAction} className="space-y-5">
            {state?.error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs px-4 py-3 rounded-xl flex items-center gap-2.5 animate-shake font-bold">
                <Info className="w-4 h-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700" htmlFor="username">
                Tên tài khoản
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#ec4899]" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Nhập tài khoản của bạn"
                  required
                  className="w-full bg-white border border-[#F3F4F6] rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-2 focus:ring-[#ec4899]/10 transition-all font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700" htmlFor="password">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#ec4899] hover:text-[#be185d] font-bold transition-colors cursor-pointer"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#ec4899]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
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

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#ec4899] hover:bg-[#be185d] text-white font-extrabold py-3 px-4 rounded-xl shadow-md shadow-[#ec4899]/10 active:scale-[0.96] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-550 font-medium">Chưa có tài khoản? </span>
            <Link
              href="/register"
              className="text-xs text-[#ec4899] hover:text-[#be185d] font-extrabold transition-colors"
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
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl animate-scale-in text-left">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4">
              <PiggyBank className="w-6 h-6 text-[#ec4899]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Thông báo cấp lại mật khẩu</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">
              Vui lòng liên hệ với quản trị viên cực kỳ dễ thương <span className="font-extrabold text-[#ec4899]">HieuChubby</span> để được hỗ trợ cấp lại mật khẩu.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full bg-rose-50 hover:bg-rose-100 text-[#ec4899] font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-sm"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
