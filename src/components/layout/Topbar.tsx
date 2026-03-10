'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { Bell, HelpCircle, Download, Menu, Search } from 'lucide-react'
import { getInitials } from '@/lib/utils'

const pageNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/finance': 'Finance Overview',
  '/finance/cod-queue': 'COD Queue',
  '/finance/deposits': 'Deposits',
  '/finance/invoicing': 'Invoicing',
  '/finance/accounting': 'Accounting',
  '/finance/reports': 'Financial Reports',
  '/hr/employees': 'Employees',
  '/hr/attendance': 'Attendance',
  '/hr/payroll': 'Payroll',
  '/hr/recruitment': 'Recruitment',
  '/hr/onboarding': 'Rider Onboarding',
  '/hr/contracts': 'Contracts & Visa',
  '/hr/performance': 'Performance',
  '/operations/drivers': 'Drivers',
  '/operations/performance': 'Driver Performance',
  '/operations/platforms': 'Platform Accounts',
  '/fleet/assets': 'Asset Master',
  '/fleet/vehicles': 'Vehicles',
  '/fleet/maintenance': 'Maintenance',
  '/fleet/insurance': 'Insurance',
  '/legal/compliance': 'Compliance',
  '/legal/documents': 'Documents',
  '/whatsapp': 'WhatsApp',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/settings/integrations': 'Integrations',
  '/admin': 'Admin Panel',
}

const subTitles: Record<string, string> = {
  '/dashboard': 'Welcome back',
  '/finance': 'Financial management',
  '/finance/cod-queue': 'Cash on delivery management',
  '/hr/employees': 'Manage all staff members',
  '/operations/drivers': 'Fleet driver management',
  '/whatsapp': 'Business messaging',
}

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user, role } = useAuth()
  const pathname = usePathname()
  const [notifOpen, setNotifOpen] = useState(false)

  const title = pageNames[pathname] || 'Dashboard'
  const subtitle = subTitles[pathname] || ''

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-100">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-none">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400">
          <Search className="w-3.5 h-3.5" />
          <span>Quick search...</span>
          <kbd className="ml-2 text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </div>

        {/* Help */}
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 w-72 bg-white rounded-2xl shadow-card-md border border-gray-100 z-50 animate-in p-4">
              <p className="font-semibold text-gray-900 text-sm mb-3">Notifications</p>
              {[
                { title: 'New COD submission', body: 'Hassan Al-Bakri submitted BD 245', time: '2m ago', dot: 'var(--accent)' },
                { title: 'Payroll processed', body: '15 records processed for March', time: '1h ago', dot: '#F59E0B' },
                { title: 'Driver suspended', body: 'Hamad Al-Buqami - review required', time: '3h ago', dot: '#EF4444' },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.dot }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-400">{n.body}</p>
                  </div>
                  <span className="text-xs text-gray-300">{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export */}
        <button
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ background: 'var(--sidebar-bg)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-hover)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-bg)'}
        >
          Export
          <Download className="w-3.5 h-3.5" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'var(--accent)' }}
          >
            {getInitials(user?.name || 'U')}
          </div>
        </div>
      </div>
    </header>
  )
}
