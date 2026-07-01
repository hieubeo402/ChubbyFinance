import React from 'react'

export default function TransactionsSkeleton() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-4 w-72 bg-zinc-150 dark:bg-zinc-850 rounded-lg" />
        </div>
        <div className="h-10 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      </div>

      {/* Filters Card Skeleton */}
      <div className="glass-card rounded-3xl p-6 space-y-4 shadow-sm dark:shadow-none">
        <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="h-10 lg:col-span-2 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
          <div className="h-10 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
          <div className="h-10 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
          <div className="h-10 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-4 bg-white/20 dark:bg-black/20 flex justify-between">
          <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-850 rounded" />
          <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-850 rounded" />
          <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-850 rounded" />
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-850 rounded" />
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-850 rounded" />
        </div>
        <div className="divide-y divide-zinc-200/50 dark:divide-zinc-800/40 p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2">
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-850 shrink-0" />
                <div className="space-y-1.5 w-1/3">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-850 rounded-lg w-3/4" />
                  <div className="h-3 bg-zinc-150 dark:bg-zinc-850 rounded-md w-1/2" />
                </div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-850 rounded-lg w-20 hidden md:block" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-850 rounded-lg w-24 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
