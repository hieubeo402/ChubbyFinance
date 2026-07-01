'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveBudgetAction(prevState: any, formData: FormData) {
  const month_year = formData.get('month_year') as string // format: MM-YYYY, e.g., '07-2026'
  const fixed_income_str = formData.get('fixed_income') as string
  const monthly_budget_str = formData.get('monthly_budget') as string

  if (!month_year || !fixed_income_str || !monthly_budget_str) {
    return { error: 'Vui lòng điền đầy đủ các trường.' }
  }

  // Validate format
  const monthYearRegex = /^(0[1-9]|1[0-2])-\d{4}$/
  if (!monthYearRegex.test(month_year)) {
    return { error: 'Định dạng tháng năm không hợp lệ (phải là MM-YYYY, ví dụ: 07-2026).' }
  }

  const fixed_income = Number(fixed_income_str)
  const monthly_budget = Number(monthly_budget_str)

  if (isNaN(fixed_income) || fixed_income < 0) {
    return { error: 'Nguồn tiền cố định hàng tháng phải là số không âm (>= 0).' }
  }

  if (isNaN(monthly_budget) || monthly_budget <= 0) {
    return { error: 'Hạn mức chi tiêu tháng phải là số dương lớn hơn 0.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Bạn chưa đăng nhập.' }
  }

  // Insert or update on conflict (upsert)
  const { error } = await supabase.from('monthly_budgets').upsert({
    user_id: user.id,
    month_year,
    fixed_income,
    monthly_budget,
  }, {
    onConflict: 'user_id,month_year'
  })

  if (error) {
    console.error('Upsert budget error:', error)
    return { error: error.message || 'Không thể lưu thông tin ngân sách.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/budget')
  revalidatePath('/dashboard/reports')

  return { success: true }
}
