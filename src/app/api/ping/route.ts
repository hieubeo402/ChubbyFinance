import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ ok: false, error: 'Missing env credentials' }, { status: 500 })
  }

  // Create a direct client bypass for fast ping
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Query a single item to keep the database active
  const { data, error } = await supabase.from('transactions').select('id').limit(1)

  if (error) {
    console.error('Ping Supabase error:', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, message: 'Database is awake', data })
}
