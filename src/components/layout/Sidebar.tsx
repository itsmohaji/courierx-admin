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
  ChevronLeft, ChevronRight, Search,
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

function SidebarContent({
  onMobileClose,
  collapsed,
  onToggleCollapse,
}: {
  onMobileClose: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}) {
  const { user, role, signOut } = useAuth()
  const pathname = usePathname()
  const [groupsCollapsed, setGroupsCollapsed] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  const nav = navByRole[role || 'super-admin'] || navByRole['super-admin']

  const toggleGroup = (g: string) =>
    setGroupsCollapsed(prev => {
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
      {/* Logo area */}
      <div
        className="flex items-center justify-between px-4 py-4"
        style={{ borderBottom: '1px solid var(--sidebar-border)' }}
      >
        <div className="flex items-center gap-2.5">
          {/* Teal diamond logo icon */}
          <div
            className="w-8 h-8 flex items-center justify-center flex-shrink-0"
            style={{
              background: 'var(--accent)',
              borderRadius: '6px',
              transform: 'rotate(45deg)',
            }}
          >
            <Truck
              style={{
                width: 16,
                height: 16,
                color: '#fff',
                transform: 'rotate(-45deg)',
              }}
            />
          </div>
          {!collapsed && (
            <span className="text-white font-bold text-lg tracking-tight">CourierX</span>
          )}
        </div>
        {/* Collapse button (desktop) / Close button (mobile) */}
        {onToggleCollapse ? (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-6 h-6 items-center justify-center rounded-md transition-colors"
            style={{ color: 'var(--sidebar-muted)' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className="w-4 h-4" style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
        ) : (
          <button onClick={onMobileClose} className="lg:hidden" style={{ color: 'var(--sidebar-text)' }}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search bar */}
      {!collapsed && (
        <div className="px-3 pt-4 pb-2">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'var(--sidebar-hover)' }}
          >
            <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--sidebar-muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-transparent text-sm w-full focus:outline-none placeholder:text-sidebar-muted"
              style={{ color: 'var(--sidebar-text)' }}
            />
            <kbd
              className="text-xs px-1.5 py-0.5 rounded font-mono hidden sm:block flex-shrink-0"
              style={{ background: 'var(--sidebar-active)', color: 'var(--sidebar-muted)', fontSize: 10 }}
            >
              ⌘F
            </kbd>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {filteredNav.map(group => (
          <div key={group.group} className="mb-2">
            {!collapsed && (
              <button
                onClick={() => toggleGroup(group.group)}
                className="flex items-center justify-between w-full px-2 py-1.5 mb-0.5 group"
              >
                <span
                  className="font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--sidebar-muted)', fontSize: 10 }}
                >
                  {group.group}
                </span>
                <ChevronDown
                  className="w-3 h-3 transition-transform duration-150"
                  style={{
                    color: 'var(--sidebar-muted)',
                    transform: groupsCollapsed.has(group.group) ? 'rotate(-90deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
            )}
            {!groupsCollapsed.has(group.group) &&
              group.items.map(item => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 relative overflow-hidden',
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
                    title={collapsed ? item.label : undefined}
                  >
                    {/* White left border accent for active */}
                    {active && (
                      <div
                        className="absolute left-0 top-0 bottom-0 rounded-r-sm"
                        style={{ width: 3, background: '#FFFFFF' }}
                      />
                    )}
                    <item.icon
                      className="flex-shrink-0"
                      style={{
                        width: 16,
                        height: 16,
                        color: active ? '#FFFFFF' : 'var(--sidebar-text)',
                      }}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className="text-white font-semibold rounded-full px-1.5 py-0.5"
                            style={{ background: 'var(--accent)', fontSize: 10 }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                )
              })}
          </div>
        ))}
      </nav>

      {/* User profile footer */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
        <div
          className="flex items-center gap-3 px-2 py-2 rounded-xl"
          style={{ background: 'var(--sidebar-hover)' }}
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
            style={{ background: 'var(--accent)' }}
          >
            {getInitials(user?.name || 'U')}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">{user?.name || 'User'}</p>
              <p className="text-xs truncate capitalize leading-tight" style={{ color: 'var(--sidebar-text)' }}>
                {role?.replace('-', ' ') || 'Admin'}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={signOut}
              className="flex-shrink-0 p-1.5 rounded-lg transition-colors hover:opacity-80"
              style={{ color: 'var(--sidebar-text)' }}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-200"
        style={{ width: sidebarCollapsed ? 68 : 256 }}
      >
        <SidebarContent
          onMobileClose={() => {}}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(v => !v)}
        />
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
