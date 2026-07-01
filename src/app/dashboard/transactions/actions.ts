'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTransactionAction(prevState: any, formData: FormData) {
  const amountStr = formData.get('amount') as string
  const type = formData.get('type') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const dateStr = formData.get('date') as string

  if (!amountStr || !type || !category || !dateStr) {
    return { error: 'Vui lòng điền đầy đủ các trường bắt buộc.' }
  }

  const amount = Number(amountStr)
  if (isNaN(amount) || amount <= 0) {
    return { error: 'Số tiền giao dịch phải là số dương lớn hơn 0.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Bạn chưa đăng nhập.' }
  }

  const { error } = await supabase.from('transactions').insert({
    user_id: user.id,
    amount,
    type,
    category,
    description: description ? description.trim() : null,
    date: dateStr,
  })

  if (error) {
    console.error('Add transaction error:', error)
    return { error: error.message || 'Không thể lưu giao dịch.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/transactions')
  revalidatePath('/dashboard/budget')
  revalidatePath('/dashboard/reports')

  return { success: true }
}

export async function deleteTransactionAction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Bạn chưa đăng nhập.' }
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Delete transaction error:', error)
    return { error: error.message || 'Không thể xóa giao dịch.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/transactions')
  revalidatePath('/dashboard/budget')
  revalidatePath('/dashboard/reports')

  return { success: true }
}
