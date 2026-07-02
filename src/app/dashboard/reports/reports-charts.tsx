'use client'

import React from 'react'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { BarChart3, LineChart as LineIcon } from 'lucide-react'

interface MonthlyTrendPoint {
  name: string
  'Thu nhập': number
  'Chi tiêu': number
}

interface DailyTrendPoint {
  day: string
  'Thu nhập': number
  'Chi tiêu': number
}

interface ReportsChartsProps {
  monthlyTrendData: MonthlyTrendPoint[]
  dailyData: DailyTrendPoint[]
  selectedMonthYear: string
}

export default function ReportsCharts({ 
  monthlyTrendData, 
  dailyData, 
  selectedMonthYear 
}: ReportsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Chart 1: 6-Month Comparison (Bar Chart) */}
      <div className="glass-card rounded-3xl p-6 space-y-4 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">So sánh Thu nhập vs Chi tiêu (6 Tháng qua)</h3>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ 
                  backgroundColor: 'var(--color-card)', 
                  borderColor: 'var(--color-border)', 
                  borderRadius: '12px',
                  color: 'var(--color-foreground)'
                }}
                labelStyle={{ color: 'var(--color-foreground)', fontWeight: 'bold' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Thu nhập" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Chi tiêu" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Daily Transaction Flow for Selected Month (Area Chart) */}
      <div className="glass-card rounded-3xl p-6 space-y-4 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 mb-2">
          <LineIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Dòng chảy tiền tệ hàng ngày (Tháng {selectedMonthYear})</h3>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ 
                  backgroundColor: 'var(--color-card)', 
                  borderColor: 'var(--color-border)', 
                  borderRadius: '12px',
                  color: 'var(--color-foreground)'
                }}
                labelStyle={{ color: 'var(--color-foreground)', fontWeight: 'bold' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="Thu nhập" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="Chi tiêu" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
