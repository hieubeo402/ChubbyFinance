'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Bell, AlertTriangle, PiggyBank, BarChart3, X } from 'lucide-react'

interface SystemNotification {
  id: string
  type: 'alert' | 'warning' | 'info' | 'report'
  title: string
  message: string
  color: 'rose' | 'amber' | 'pink' | 'indigo'
}

export default function NotificationBell({ notifications }: { notifications: SystemNotification[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl flex items-center justify-center border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-slate-655 dark:text-slate-400 hover:text-[#ec4899] dark:hover:text-white transition-all cursor-pointer relative shadow-sm"
        title="Thông báo nhắc nhở"
      >
        <Bell className="w-5 h-5" />
        
        {/* Glowing badge count */}
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500 text-[9px] font-extrabold text-white items-center justify-center">
              {notifications.length}
            </span>
          </span>
        )}
      </button>

      {/* Glassmorphic Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 glass-card rounded-3xl p-4 shadow-2xl z-50 animate-scale-in text-left space-y-3 border border-white/60 dark:border-zinc-800/80 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
            <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#ec4899]" />
              Nhắc nhở tài chính ({notifications.length})
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500 font-medium">
              Không có nhắc nhở nào mới. Bạn đang quản lý rất tốt! Heo đất 🐷
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => {
                // Color styles
                let borderClass = 'border-rose-500/20 bg-rose-500/[0.02] text-rose-700 dark:text-rose-400'
                let iconColor = 'text-rose-500'
                if (notif.color === 'amber') {
                  borderClass = 'border-amber-500/20 bg-amber-500/[0.02] text-amber-700 dark:text-amber-400'
                  iconColor = 'text-amber-500'
                } else if (notif.color === 'pink') {
                  borderClass = 'border-pink-500/20 bg-pink-500/[0.02] text-pink-700 dark:text-pink-400'
                  iconColor = 'text-pink-500'
                } else if (notif.color === 'indigo') {
                  borderClass = 'border-indigo-500/20 bg-indigo-500/[0.02] text-indigo-700 dark:text-indigo-400'
                  iconColor = 'text-indigo-550 dark:text-indigo-400'
                }

                return (
                  <div key={notif.id} className={`border rounded-2xl p-3 flex gap-2.5 items-start text-xs transition-all ${borderClass}`}>
                    <div className="shrink-0 mt-0.5">
                      {notif.type === 'alert' && <AlertTriangle className={`w-4 h-4 ${iconColor}`} />}
                      {notif.type === 'warning' && <AlertTriangle className={`w-4 h-4 ${iconColor}`} />}
                      {notif.type === 'info' && <PiggyBank className={`w-4 h-4 ${iconColor}`} />}
                      {notif.type === 'report' && <BarChart3 className={`w-4 h-4 ${iconColor}`} />}
                    </div>
                    <div>
                      <h5 className="font-bold uppercase tracking-wide opacity-90 text-[10px]">{notif.title}</h5>
                      <p className="mt-0.5 leading-relaxed opacity-85 font-medium text-[11px]">{notif.message}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
