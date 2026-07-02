'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface ChartDataPoint {
  name: string
  value: number
}

interface BudgetPieChartProps {
  chartData: ChartDataPoint[]
  totalExpense: number
  colors: string[]
}

export default function BudgetPieChart({ 
  chartData, 
  totalExpense, 
  colors 
}: BudgetPieChartProps) {
  return (
    <div className="h-44 w-full relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{ 
              backgroundColor: 'var(--color-card)', 
              borderColor: 'var(--color-border)', 
              borderRadius: '12px',
              color: 'var(--color-foreground)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute text-center pointer-events-none">
        <span className="text-base font-extrabold text-slate-800 dark:text-white">
          {formatCurrency(totalExpense)}
        </span>
        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Tổng chi tiêu</p>
      </div>
    </div>
  )
}
