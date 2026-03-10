'use client'

import React, { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, Search, ChevronDown, User, Settings, LogOut, Menu, Check, MessageSquare } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/admin': 'Admin Panel',
  '/finance': 'Finance Overview',
  '/finance/cod-queue': 'COD Queue',
  '/finance/deposits': 'Deposits',
  '/finance/reports': 'Reports',
  '/hr/employees': 'Employees',
  '/hr/attendance': 'Attendance',
  '/hr/payroll': 'Payroll',
  '/hr/recruitment': 'Recruitment',
  '/operations/drivers': 'Drivers',
  '/operations/performance': 'Performance',
  '/legal/compliance': 'Compliance',
  '/legal/documents': 'Documents',
  '/settings': 'Settings',
}

function getBreadcrumbs(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  const crumbs = [{ label: 'CourierX', href: '/dashboard' }]
  let path = ''
  for (const part of parts) {
    path += `/${part}`
    const label = routeLabels[path]
    if (label) crumbs.push({ label, href: path })
  }
  return crumbs
}

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user, role, signOut } = useAuth()
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications(user?.id)
  const pathname = usePathname()
  const router = useRouter()
  const crumbs = getBreadcrumbs(pathname)
  const pageTitle = routeLabels[pathname] || 'Dashboard'

  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const notifTypeIcon = (type: string) => {
    const map: Record<string, string> = {
      info: '💬',
      success: '✅',
      warning: '⚠️',
      error: '🚨',
    }
    return map[type] || '💬'
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 flex-shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb / Title */}
        <div className="flex-1 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 mb-0.5">
            {crumbs.map((crumb, i) => (
              <React.Fragment key={crumb.href}>
                {i > 0 && <span className="text-gray-300">/</span>}
                <button
                  onClick={() => router.push(crumb.href)}
                  className={cn(
                    'hover:text-primary-600 transition-colors',
                    i === crumbs.length - 1 ? 'text-gray-700 font-medium' : ''
                  )}
                >
                  {crumb.label}
                </button>
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-base font-semibold text-gray-900 leading-none sm:hidden">{pageTitle}</h1>
        </div>

        {/* Search */}
        <div className="hidden md:flex relative w-64 xl:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Messages icon */}
          <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 relative">
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full px-0.5">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Check className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={cn(
                          'flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors',
                          !n.read && 'bg-primary-50/50'
                        )}
                        onClick={() => markRead(n.id)}
                      >
                        <span className="text-base flex-shrink-0 mt-0.5">{notifTypeIcon(n.type)}</span>
                        <div className="min-w-0 flex-1">
                          <p className={cn('text-sm', !n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700')}>{n.title}</p>
                          <p className="text-xs text-gray-500 truncate">{n.body}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatDate(n.createdAt)}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0 mt-1.5" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-700 leading-none">{user?.name?.split(' ')[0] || 'User'}</p>
                <p className="text-xs text-gray-400 capitalize mt-0.5">{role?.replace('-', ' ') || 'Admin'}</p>
              </div>
              <ChevronDown className={cn('w-3.5 h-3.5 text-gray-400 transition-transform', profileOpen && 'rotate-180')} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { router.push('/settings'); setProfileOpen(false) }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    Profile
                  </button>
                  <button
                    onClick={() => { router.push('/settings'); setProfileOpen(false) }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Settings
                  </button>
                </div>
                <div className="py-1 border-t border-gray-100">
                  <button
                    onClick={() => { signOut(); setProfileOpen(false) }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
