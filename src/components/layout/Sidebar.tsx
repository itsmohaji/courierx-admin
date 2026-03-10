'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { LogOut, ChevronDown, X, Menu, Truck } from 'lucide-react'
import type { Role } from '@/types'

interface NavItem {
  label: string
  icon: string
  href: string
}

interface NavGroup {
  group: string
  items: NavItem[]
}

const navConfig: Record<Role, NavGroup[]> = {
  'super-admin': [
    {
      group: 'MAIN',
      items: [
        { label: 'Dashboard', icon: '📊', href: '/dashboard' },
        { label: 'Admin Panel', icon: '⚙️', href: '/admin' },
      ],
    },
    {
      group: 'FINANCE',
      items: [
        { label: 'Finance Overview', icon: '💰', href: '/finance' },
        { label: 'COD Queue', icon: '📋', href: '/finance/cod-queue' },
        { label: 'Deposits', icon: '🏦', href: '/finance/deposits' },
        { label: 'Reports', icon: '📈', href: '/finance/reports' },
      ],
    },
    {
      group: 'HR',
      items: [
        { label: 'Employees', icon: '👥', href: '/hr/employees' },
        { label: 'Attendance', icon: '📅', href: '/hr/attendance' },
        { label: 'Payroll', icon: '💵', href: '/hr/payroll' },
        { label: 'Recruitment', icon: '🔍', href: '/hr/recruitment' },
      ],
    },
    {
      group: 'OPERATIONS',
      items: [
        { label: 'Drivers', icon: '🚗', href: '/operations/drivers' },
        { label: 'Performance', icon: '⭐', href: '/operations/performance' },
      ],
    },
    {
      group: 'LEGAL',
      items: [
        { label: 'Compliance', icon: '⚖️', href: '/legal/compliance' },
        { label: 'Documents', icon: '📄', href: '/legal/documents' },
      ],
    },
    {
      group: 'GENERAL',
      items: [
        { label: 'Settings', icon: '⚙️', href: '/settings' },
      ],
    },
  ],
  ceo: [
    {
      group: 'MAIN',
      items: [
        { label: 'Dashboard', icon: '📊', href: '/dashboard' },
      ],
    },
    {
      group: 'FINANCE',
      items: [
        { label: 'Finance Overview', icon: '💰', href: '/finance' },
        { label: 'Reports', icon: '📈', href: '/finance/reports' },
      ],
    },
    {
      group: 'HR',
      items: [
        { label: 'Employees', icon: '👥', href: '/hr/employees' },
        { label: 'Payroll', icon: '💵', href: '/hr/payroll' },
      ],
    },
    {
      group: 'OPERATIONS',
      items: [
        { label: 'Drivers', icon: '🚗', href: '/operations/drivers' },
        { label: 'Performance', icon: '⭐', href: '/operations/performance' },
      ],
    },
    {
      group: 'GENERAL',
      items: [
        { label: 'Settings', icon: '⚙️', href: '/settings' },
      ],
    },
  ],
  gm: [
    {
      group: 'MAIN',
      items: [
        { label: 'Dashboard', icon: '📊', href: '/dashboard' },
      ],
    },
    {
      group: 'FINANCE',
      items: [
        { label: 'Finance Overview', icon: '💰', href: '/finance' },
        { label: 'COD Queue', icon: '📋', href: '/finance/cod-queue' },
        { label: 'Reports', icon: '📈', href: '/finance/reports' },
      ],
    },
    {
      group: 'HR',
      items: [
        { label: 'Employees', icon: '👥', href: '/hr/employees' },
        { label: 'Attendance', icon: '📅', href: '/hr/attendance' },
      ],
    },
    {
      group: 'OPERATIONS',
      items: [
        { label: 'Drivers', icon: '🚗', href: '/operations/drivers' },
        { label: 'Performance', icon: '⭐', href: '/operations/performance' },
      ],
    },
    {
      group: 'GENERAL',
      items: [
        { label: 'Settings', icon: '⚙️', href: '/settings' },
      ],
    },
  ],
  finance: [
    {
      group: 'MAIN',
      items: [
        { label: 'Dashboard', icon: '📊', href: '/dashboard' },
      ],
    },
    {
      group: 'FINANCE',
      items: [
        { label: 'Finance Overview', icon: '💰', href: '/finance' },
        { label: 'COD Queue', icon: '📋', href: '/finance/cod-queue' },
        { label: 'Deposits', icon: '🏦', href: '/finance/deposits' },
        { label: 'Reports', icon: '📈', href: '/finance/reports' },
      ],
    },
    {
      group: 'GENERAL',
      items: [
        { label: 'Settings', icon: '⚙️', href: '/settings' },
      ],
    },
  ],
  hr: [
    {
      group: 'MAIN',
      items: [
        { label: 'Dashboard', icon: '📊', href: '/dashboard' },
      ],
    },
    {
      group: 'HR',
      items: [
        { label: 'Employees', icon: '👥', href: '/hr/employees' },
        { label: 'Attendance', icon: '📅', href: '/hr/attendance' },
        { label: 'Payroll', icon: '💵', href: '/hr/payroll' },
        { label: 'Recruitment', icon: '🔍', href: '/hr/recruitment' },
      ],
    },
    {
      group: 'GENERAL',
      items: [
        { label: 'Settings', icon: '⚙️', href: '/settings' },
      ],
    },
  ],
  legal: [
    {
      group: 'MAIN',
      items: [
        { label: 'Dashboard', icon: '📊', href: '/dashboard' },
      ],
    },
    {
      group: 'LEGAL',
      items: [
        { label: 'Compliance', icon: '⚖️', href: '/legal/compliance' },
        { label: 'Documents', icon: '📄', href: '/legal/documents' },
      ],
    },
    {
      group: 'GENERAL',
      items: [
        { label: 'Settings', icon: '⚙️', href: '/settings' },
      ],
    },
  ],
}

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { user, role, signOut } = useAuth()
  const pathname = usePathname()
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const nav = navConfig[role || 'super-admin'] || navConfig['super-admin']

  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      if (next.has(group)) next.delete(group)
      else next.add(group)
      return next
    })
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/'
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-primary-700">
        <div className="flex-shrink-0 w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-lg leading-none">CourierX</p>
          <p className="text-primary-200 text-xs">Enterprise Platform</p>
        </div>
        <button
          onClick={onMobileClose}
          className="ml-auto lg:hidden text-primary-200 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {nav.map(group => (
          <div key={group.group} className="mb-4">
            <button
              className="flex items-center justify-between w-full px-3 py-1.5 mb-1"
              onClick={() => toggleGroup(group.group)}
            >
              <span className="text-xs font-semibold text-primary-300 uppercase tracking-wider">
                {group.group}
              </span>
              <ChevronDown
                className={cn(
                  'w-3 h-3 text-primary-400 transition-transform',
                  collapsedGroups.has(group.group) && '-rotate-90'
                )}
              />
            </button>
            {!collapsedGroups.has(group.group) && (
              <div className="space-y-0.5">
                {group.items.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                      isActive(item.href)
                        ? 'bg-white/15 text-white shadow-sm'
                        : 'text-primary-100 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <span className="text-base w-5 flex-shrink-0 text-center">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive(item.href) && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User info */}
      <div className="border-t border-primary-700 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-primary-300 truncate capitalize">{role?.replace('-', ' ') || 'Admin'}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-gradient-to-b from-primary-700 to-primary-900 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onMobileClose}
          />
          <aside className="relative w-64 bg-gradient-to-b from-primary-700 to-primary-900 h-full flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
    >
      <Menu className="w-5 h-5" />
    </button>
  )
}
