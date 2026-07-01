'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addDebtLoanAction(prevState: any, formData: FormData) {
  const type = formData.get('type') as string
  const partner_name = formData.get('partner_name') as string
  const total_amount_str = formData.get('total_amount') as string
  const due_date = formData.get('due_date') as string

  if (!type || !partner_name || !total_amount_str || !due_date) {
    return { error: 'Vui lòng điền đầy đủ tất cả các trường.' }
  }

  const total_amount = Number(total_amount_str)
  if (isNaN(total_amount) || total_amount <= 0) {
    return { error: 'Tổng số tiền gốc phải là số dương lớn hơn 0.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Bạn chưa đăng nhập.' }
  }

  const { error } = await supabase.from('debts_loans').insert({
    user_id: user.id,
    type,
    partner_name: partner_name.trim(),
    total_amount,
    remaining_amount: total_amount, // initially equal to total
    due_date,
    status: 'active',
  })

  if (error) {
    console.error('Add debt/loan error:', error)
    return { error: error.message || 'Không thể lưu khoản nợ/cho vay.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/debts-loans')

  return { success: true }
}

export async function deleteDebtLoanAction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Bạn chưa đăng nhập.' }
  }

  const { error } = await supabase
    .from('debts_loans')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Delete debt/loan error:', error)
    return { error: error.message || 'Không thể xóa khoản nợ/cho vay.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/debts-loans')

  return { success: true }
}

export async function addPaymentAction(prevState: any, formData: FormData) {
  const debt_loan_id = formData.get('debt_loan_id') as string
  const amount_paid_str = formData.get('amount_paid') as string
  const paid_date = formData.get('paid_date') as string
  const note = formData.get('note') as string

  if (!debt_loan_id || !amount_paid_str || !paid_date) {
    return { error: 'Vui lòng nhập đầy đủ số tiền thanh toán và ngày thực hiện.' }
  }

  const amount_paid = Number(amount_paid_str)
  if (isNaN(amount_paid) || amount_paid <= 0) {
    return { error: 'Số tiền thanh toán phải lớn hơn 0.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Bạn chưa đăng nhập.' }
  }

  // Double check that the debt/loan exists and belongs to the user
  const { data: debtLoan, error: fetchError } = await supabase
    .from('debts_loans')
    .select('remaining_amount, partner_name')
    .eq('id', debt_loan_id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !debtLoan) {
    return { error: 'Không tìm thấy thông tin khoản nợ/cho vay tương ứng.' }
  }

  if (amount_paid > Number(debtLoan.remaining_amount)) {
    return { error: `Số tiền thanh toán vượt quá số nợ còn lại (${debtLoan.remaining_amount}).` }
  }

  const { error } = await supabase.from('debt_loan_history').insert({
    debt_loan_id,
    amount_paid,
    paid_date,
    note: note ? note.trim() : null,
  })

  if (error) {
    console.error('Add payment history error:', error)
    return { error: error.message || 'Không thể ghi nhận lịch sử thanh toán.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/debts-loans')

  return { success: true }
}
