import React from 'react'

export default function ReportsSkeleton() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 w-44 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-4 w-80 bg-zinc-150 dark:bg-zinc-850 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      </div>

      {/* Selected Month Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-3xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-850 rounded-xl shrink-0" />
            <div className="space-y-2 w-2/3">
              <div className="h-3 bg-zinc-150 dark:bg-zinc-850 rounded-md w-1/2" />
              <div className="h-5 bg-zinc-200 dark:bg-zinc-850 rounded-lg w-3/4" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1 */}
        <div className="glass-card rounded-3xl p-6 space-y-4 shadow-sm dark:shadow-none">
          <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-805 rounded-lg mb-4" />
          <div className="h-80 bg-zinc-100/30 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl flex items-end p-4 justify-around">
            <div className="w-6 h-40 bg-zinc-200 dark:bg-zinc-850 rounded-t" />
            <div className="w-6 h-56 bg-zinc-200 dark:bg-zinc-850 rounded-t" />
            <div className="w-6 h-28 bg-zinc-200 dark:bg-zinc-850 rounded-t" />
            <div className="w-6 h-48 bg-zinc-200 dark:bg-zinc-850 rounded-t" />
            <div className="w-6 h-64 bg-zinc-200 dark:bg-zinc-850 rounded-t" />
          </div>
        </div>

        {/* Chart 2 */}
        <div className="glass-card rounded-3xl p-6 space-y-4 shadow-sm dark:shadow-none">
          <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-805 rounded-lg mb-4" />
          <div className="h-80 bg-zinc-100/30 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl flex items-center justify-center">
            {/* Draw a fake line inside the skeleton */}
            <div className="h-2 w-3/4 bg-zinc-200 dark:bg-zinc-850 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
