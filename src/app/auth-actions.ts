'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUpAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!username || !password || !confirmPassword) {
    return { error: 'Vui lòng điền đầy đủ tất cả các trường.' }
  }

  if (username.length < 3) {
    return { error: 'Tên tài khoản phải chứa ít nhất 3 ký tự.' }
  }

  if (password.length < 6) {
    return { error: 'Mật khẩu phải chứa ít nhất 6 ký tự.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Mật khẩu xác nhận không khớp.' }
  }

  // Format username as internal email format for Supabase Auth
  const email = `${username.trim().toLowerCase()}@chubbyfinance.com`
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username.trim(),
      },
    },
  })

  if (error) {
    console.error('Sign up error:', error)
    if (error.message.includes('already registered')) {
      return { error: 'Tên tài khoản này đã được đăng ký.' }
    }
    return { error: error.message || 'Đã có lỗi xảy ra trong quá trình đăng ký.' }
  }

  // Supabase might require email confirmation depending on settings. 
  // For standard localhost/development without SMTP, it will automatically log in or create the user.
  // We will redirect to login or dashboard. Let's redirect to login page with a success flag.
  return { success: true, message: 'Đăng ký thành công! Vui lòng đăng nhập.' }
}

export async function signInAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Vui lòng điền đầy đủ Tên tài khoản và Mật khẩu.' }
  }

  const email = `${username.trim().toLowerCase()}@chubbyfinance.com`
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Sign in error:', error)
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Tên tài khoản hoặc mật khẩu không chính xác.' }
    }
    return { error: error.message || 'Đăng nhập thất bại.' }
  }

  redirect('/dashboard')
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function changePasswordAction(prevState: any, formData: FormData) {
  const newPassword = formData.get('newPassword') as string
  const confirmNewPassword = formData.get('confirmNewPassword') as string

  if (!newPassword || !confirmNewPassword) {
    return { error: 'Vui lòng điền đầy đủ tất cả các trường.' }
  }

  if (newPassword.length < 6) {
    return { error: 'Mật khẩu mới phải chứa ít nhất 6 ký tự.' }
  }

  if (newPassword !== confirmNewPassword) {
    return { error: 'Mật khẩu xác nhận không khớp.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    console.error('Change password error:', error)
    return { error: error.message || 'Không thể cập nhật mật khẩu.' }
  }

  return { success: true, message: 'Đổi mật khẩu thành công!' }
}
