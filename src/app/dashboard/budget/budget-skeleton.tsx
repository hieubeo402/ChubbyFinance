import React from 'react'

export default function BudgetSkeleton() {
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-6 space-y-6 shadow-sm dark:shadow-none">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                <div className="h-4 w-48 bg-zinc-150 dark:bg-zinc-850 rounded-md" />
              </div>
              <div className="h-8 w-28 bg-zinc-200 dark:bg-zinc-850 rounded-lg" />
            </div>

            {/* Financial summaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-20 bg-white/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4" />
              <div className="h-20 bg-white/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4" />
            </div>

            {/* Progress bar */}
            <div className="space-y-3 pt-2">
              <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-850 rounded-lg" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-850 rounded-full w-full" />
              <div className="h-3 w-1/2 bg-zinc-150 dark:bg-zinc-850 rounded-md" />
            </div>
          </div>
        </div>

        {/* Right Column Pie */}
        <div className="glass-card rounded-3xl p-6 space-y-6 shadow-sm dark:shadow-none">
          <div className="space-y-2">
            <div className="h-6 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            <div className="h-4 w-44 bg-zinc-150 dark:bg-zinc-850 rounded-md" />
          </div>

          <div className="h-44 w-44 rounded-full border-[10px] border-zinc-200 dark:border-zinc-850 mx-auto flex items-center justify-center">
            <div className="h-10 w-20 bg-zinc-150 dark:bg-zinc-850 rounded" />
          </div>

          <div className="space-y-3 pt-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-850 rounded" />
                  <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-850 rounded" />
                </div>
                <div className="h-1 bg-zinc-150 dark:bg-zinc-850 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
