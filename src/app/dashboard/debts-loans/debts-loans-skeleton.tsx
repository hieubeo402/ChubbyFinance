import React from 'react'

export default function DebtsLoansSkeleton() {
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

      {/* Stats Summary Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-28 bg-zinc-100/40 dark:bg-zinc-900/45 border border-zinc-200/50 dark:border-zinc-800/80 rounded-3xl p-6" />
        <div className="h-28 bg-zinc-100/40 dark:bg-zinc-900/45 border border-zinc-200/50 dark:border-zinc-800/80 rounded-3xl p-6" />
      </div>

      {/* Two lists columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Debts Column */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-2" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="glass-card rounded-3xl p-6 space-y-4 shadow-sm dark:shadow-none">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-850 shrink-0" />
                <div className="flex-1 space-y-3 w-full">
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-850 rounded-lg w-2/3" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-4 bg-zinc-150 dark:bg-zinc-850 rounded-md w-3/4" />
                    <div className="h-4 bg-zinc-150 dark:bg-zinc-850 rounded-md w-1/2" />
                  </div>
                  <div className="h-3.5 bg-zinc-150 dark:bg-zinc-850 rounded-md w-2/5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loans Column */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-2" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="glass-card rounded-3xl p-6 space-y-4 shadow-sm dark:shadow-none">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-850 shrink-0" />
                <div className="flex-1 space-y-3 w-full">
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-850 rounded-lg w-2/3" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-4 bg-zinc-150 dark:bg-zinc-850 rounded-md w-3/4" />
                    <div className="h-4 bg-zinc-150 dark:bg-zinc-850 rounded-md w-1/2" />
                  </div>
                  <div className="h-3.5 bg-zinc-150 dark:bg-zinc-850 rounded-md w-2/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
