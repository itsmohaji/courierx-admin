'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { Bell, HelpCircle, Upload, Menu, Plus } from 'lucide-react'
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
  '/dashboard': 'Welcome back — here\'s what\'s happening today',
  '/finance': 'Financial management & cash flow',
  '/finance/cod-queue': 'Cash on delivery management',
  '/hr/employees': 'Manage all staff members',
  '/operations/drivers': 'Fleet driver management',
  '/whatsapp': 'Business messaging',
}

// Sample avatar colors for the cluster
const AVATAR_COLORS = ['#14B8A6', '#0D9488', '#059669']
const AVATAR_INITIALS = ['AK', 'SA', 'MQ']

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
    <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100 sticky top-0 z-30">
      {/* Left: mobile menu + page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5 leading-none">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: avatar cluster, actions, export */}
      <div className="flex items-center gap-2.5">
        {/* User avatar cluster */}
        <div className="hidden sm:flex items-center">
          <div className="flex -space-x-2">
            {AVATAR_INITIALS.map((initials, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                style={{ background: AVATAR_COLORS[i] }}
                title={initials}
              >
                {initials}
              </div>
            ))}
          </div>
          {/* Plus button */}
          <button
            className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors -ml-2 z-10"
            title="Add member"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-gray-100 mx-1" />

        {/* Help */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
          title="Help"
        >
          <HelpCircle className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full border-2 border-white"
              style={{ background: 'var(--accent)' }}
            />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 w-72 bg-white rounded-2xl shadow-card-md border border-gray-100 z-50 animate-in p-4">
              <p className="font-semibold text-gray-900 text-sm mb-3">Notifications</p>
              {[
                { title: 'New COD submission', body: 'Hassan Al-Bakri submitted BD 245', time: '2m ago', dot: 'var(--accent)' },
                { title: 'Payroll processed', body: '15 records processed for March', time: '1h ago', dot: '#F59E0B' },
                { title: 'Driver suspended', body: 'Hamad Al-Buqami — review required', time: '3h ago', dot: '#EF4444' },
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

        {/* Export button — dark green */}
        <button
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ background: 'var(--sidebar-bg)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-hover)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-bg)'}
        >
          <Upload className="w-3.5 h-3.5" />
          Export
        </button>
      </div>
    </header>
  )
}
