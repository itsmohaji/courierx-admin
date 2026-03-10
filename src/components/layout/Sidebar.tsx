'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'
import {
  LogOut, ChevronDown, X, Truck,
  LayoutDashboard, DollarSign, Users, Car, FileText,
  Settings, MessageCircle, BarChart3, Shield,
  UserPlus, ClipboardList, CreditCard, Wrench,
  Building2, Calculator, Receipt, Package,
  ChevronRight, Search,
} from 'lucide-react'
import type { Role } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
}

interface NavGroup {
  group: string
  items: NavItem[]
}

const navByRole: Record<Role, NavGroup[]> = {
  'super-admin': [
    {
      group: 'Main Menu',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Admin Panel', href: '/admin', icon: Shield },
      ],
    },
    {
      group: 'Finance',
      items: [
        { label: 'Overview', href: '/finance', icon: DollarSign },
        { label: 'COD Queue', href: '/finance/cod-queue', icon: ClipboardList },
        { label: 'Deposits', href: '/finance/deposits', icon: CreditCard },
        { label: 'Invoicing', href: '/finance/invoicing', icon: Receipt },
        { label: 'Accounting', href: '/finance/accounting', icon: Calculator },
        { label: 'Reports', href: '/finance/reports', icon: BarChart3 },
      ],
    },
    {
      group: 'HR & People',
      items: [
        { label: 'Employees', href: '/hr/employees', icon: Users },
        { label: 'Attendance', href: '/hr/attendance', icon: ClipboardList },
        { label: 'Payroll', href: '/hr/payroll', icon: DollarSign },
        { label: 'Recruitment', href: '/hr/recruitment', icon: UserPlus },
        { label: 'Rider Onboarding', href: '/hr/onboarding', icon: Truck },
        { label: 'Contracts & Visa', href: '/hr/contracts', icon: FileText },
        { label: 'Performance', href: '/hr/performance', icon: BarChart3 },
      ],
    },
    {
      group: 'Operations',
      items: [
        { label: 'Drivers', href: '/operations/drivers', icon: Car },
        { label: 'Driver Performance', href: '/operations/performance', icon: BarChart3 },
        { label: 'Platform Accounts', href: '/operations/platforms', icon: Package },
      ],
    },
    {
      group: 'Fleet & Assets',
      items: [
        { label: 'Asset Master', href: '/fleet/assets', icon: Package },
        { label: 'Vehicles', href: '/fleet/vehicles', icon: Car },
        { label: 'Maintenance', href: '/fleet/maintenance', icon: Wrench },
        { label: 'Insurance', href: '/fleet/insurance', icon: Shield },
      ],
    },
    {
      group: 'Legal',
      items: [
        { label: 'Compliance', href: '/legal/compliance', icon: Shield },
        { label: 'Documents', href: '/legal/documents', icon: FileText },
      ],
    },
    {
      group: 'Other',
      items: [
        { label: 'WhatsApp', href: '/whatsapp', icon: MessageCircle, badge: 5 },
        { label: 'Analytics', href: '/analytics', icon: BarChart3 },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Settings', href: '/settings', icon: Settings },
        { label: 'Integrations', href: '/settings/integrations', icon: Building2 },
      ],
    },
  ],
  ceo: [
    {
      group: 'Main Menu',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Finance',
      items: [
        { label: 'Overview', href: '/finance', icon: DollarSign },
        { label: 'Reports', href: '/finance/reports', icon: BarChart3 },
      ],
    },
    {
      group: 'Operations',
      items: [
        { label: 'Drivers', href: '/operations/drivers', icon: Car },
        { label: 'Driver Performance', href: '/operations/performance', icon: BarChart3 },
        { label: 'Platform Accounts', href: '/operations/platforms', icon: Package },
      ],
    },
    {
      group: 'HR & People',
      items: [
        { label: 'Employees', href: '/hr/employees', icon: Users },
        { label: 'Performance', href: '/hr/performance', icon: BarChart3 },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ],
  gm: [
    {
      group: 'Main Menu',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Finance',
      items: [
        { label: 'Overview', href: '/finance', icon: DollarSign },
        { label: 'COD Queue', href: '/finance/cod-queue', icon: ClipboardList },
        { label: 'Reports', href: '/finance/reports', icon: BarChart3 },
      ],
    },
    {
      group: 'Operations',
      items: [
        { label: 'Drivers', href: '/operations/drivers', icon: Car },
        { label: 'Driver Performance', href: '/operations/performance', icon: BarChart3 },
        { label: 'Platform Accounts', href: '/operations/platforms', icon: Package },
      ],
    },
    {
      group: 'HR & People',
      items: [
        { label: 'Employees', href: '/hr/employees', icon: Users },
        { label: 'Attendance', href: '/hr/attendance', icon: ClipboardList },
      ],
    },
    {
      group: 'Fleet & Assets',
      items: [
        { label: 'Vehicles', href: '/fleet/vehicles', icon: Car },
        { label: 'Maintenance', href: '/fleet/maintenance', icon: Wrench },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ],
  finance: [
    {
      group: 'Main Menu',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Finance',
      items: [
        { label: 'Overview', href: '/finance', icon: DollarSign },
        { label: 'COD Queue', href: '/finance/cod-queue', icon: ClipboardList },
        { label: 'Deposits', href: '/finance/deposits', icon: CreditCard },
        { label: 'Invoicing', href: '/finance/invoicing', icon: Receipt },
        { label: 'Accounting', href: '/finance/accounting', icon: Calculator },
        { label: 'Reports', href: '/finance/reports', icon: BarChart3 },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ],
  hr: [
    {
      group: 'Main Menu',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'HR & People',
      items: [
        { label: 'Employees', href: '/hr/employees', icon: Users },
        { label: 'Attendance', href: '/hr/attendance', icon: ClipboardList },
        { label: 'Payroll', href: '/hr/payroll', icon: DollarSign },
        { label: 'Recruitment', href: '/hr/recruitment', icon: UserPlus },
        { label: 'Rider Onboarding', href: '/hr/onboarding', icon: Truck },
        { label: 'Contracts & Visa', href: '/hr/contracts', icon: FileText },
        { label: 'Performance', href: '/hr/performance', icon: BarChart3 },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ],
  legal: [
    {
      group: 'Main Menu',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Legal',
      items: [
        { label: 'Compliance', href: '/legal/compliance', icon: Shield },
        { label: 'Documents', href: '/legal/documents', icon: FileText },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ],
}

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

function SidebarContent({ onMobileClose }: { onMobileClose: () => void }) {
  const { user, role, signOut } = useAuth()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  const nav = navByRole[role || 'super-admin'] || navByRole['super-admin']

  const toggleGroup = (g: string) =>
    setCollapsed(prev => {
      const n = new Set(prev)
      n.has(g) ? n.delete(g) : n.add(g)
      return n
    })

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard' || pathname === '/'
      : pathname === href || pathname.startsWith(href + '/')

  const filteredNav = search
    ? nav.map(g => ({
        ...g,
        items: g.items.filter(i => i.label.toLowerCase().includes(search.toLowerCase())),
      })).filter(g => g.items.length > 0)
    : nav

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--sidebar-bg)' }}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <Truck className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">CourierX</span>
        </div>
        <button onClick={onMobileClose} className="lg:hidden" style={{ color: 'var(--sidebar-text)' }}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--sidebar-hover)' }}>
          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--sidebar-text)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            className="bg-transparent text-sm w-full focus:outline-none"
            style={{ color: 'var(--sidebar-text)' }}
          />
          <span className="text-xs px-1.5 py-0.5 rounded font-mono hidden sm:block" style={{ background: 'var(--sidebar-active)', color: 'var(--sidebar-text)' }}>⌘F</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {filteredNav.map(group => (
          <div key={group.group} className="mb-3">
            <button
              onClick={() => toggleGroup(group.group)}
              className="flex items-center justify-between w-full px-2 py-1.5 mb-0.5 group"
            >
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--sidebar-muted)', fontSize: 10 }}>
                {group.group}
              </span>
              <ChevronDown
                className="w-3 h-3 transition-transform"
                style={{
                  color: 'var(--sidebar-muted)',
                  transform: collapsed.has(group.group) ? 'rotate(-90deg)' : 'rotate(0deg)',
                }}
              />
            </button>
            {!collapsed.has(group.group) && group.items.map(item => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 group relative',
                  )}
                  style={{
                    background: active ? 'var(--sidebar-active)' : 'transparent',
                    color: active ? '#FFFFFF' : 'var(--sidebar-text)',
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-hover)'
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full" style={{ background: 'var(--accent)' }} />
                  )}
                  <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: active ? 'var(--accent)' : 'var(--sidebar-text)' }} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full text-white font-semibold" style={{ background: 'var(--accent)', fontSize: 10 }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl" style={{ background: 'var(--sidebar-hover)' }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
            style={{ background: 'var(--accent)' }}
          >
            {getInitials(user?.name || 'U')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs truncate capitalize" style={{ color: 'var(--sidebar-text)' }}>
              {role?.replace('-', ' ') || 'Admin'}
            </p>
          </div>
          <button
            onClick={signOut}
            className="flex-shrink-0 p-1 rounded-lg transition-colors"
            style={{ color: 'var(--sidebar-text)' }}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0">
        <SidebarContent onMobileClose={() => {}} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={onMobileClose} />
          <aside className="relative w-64 flex flex-col h-full">
            <SidebarContent onMobileClose={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  )
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
      <ChevronRight className="w-5 h-5" />
    </button>
  )
}
