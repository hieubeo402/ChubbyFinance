import React from 'react'

export default function DashboardLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] select-none">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated premium iOS-like spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 dark:border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          Đang tải dữ liệu...
        </p>
      </div>
    </div>
  )
}
