import React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  variant?: 'hero' | 'default' | 'teal' | 'amber' | 'red'
  className?: string
  subValue?: string
}

export function StatsCard({ label, value, change, changeLabel, icon, variant = 'default', className, subValue }: StatsCardProps) {
  const isPositive = (change || 0) >= 0

  if (variant === 'hero') {
    return (
      <div
        className={cn('rounded-2xl p-5 text-white relative overflow-hidden', className)}
        style={{ background: 'linear-gradient(135deg, var(--sidebar-bg) 0%, #1C4229 100%)' }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-8 translate-x-8" style={{ background: 'var(--accent)' }} />
        <div className="relative">
          {icon && (
            <div className="inline-flex p-2 rounded-xl mb-3" style={{ background: 'rgba(20,184,166,0.2)' }}>
              {icon}
            </div>
          )}
          <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subValue && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{subValue}</p>}
          {change !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: isPositive ? 'rgba(20,184,166,0.25)' : 'rgba(239,68,68,0.25)', color: isPositive ? '#5EEAD4' : '#FCA5A5' }}
              >
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(change).toFixed(1)}%
              </span>
              {changeLabel && <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{changeLabel}</span>}
            </div>
          )}
        </div>
      </div>
    )
  }

  const iconBgMap = {
    default: { bg: '#F0FDF9', color: 'var(--accent)' },
    teal:    { bg: '#F0FDF9', color: 'var(--accent)' },
    amber:   { bg: '#FFFBEB', color: '#F59E0B' },
    red:     { bg: '#FFF5F5', color: '#EF4444' },
  }
  const iconStyle = iconBgMap[variant as keyof typeof iconBgMap] || iconBgMap.default

  return (
    <div className={cn('bg-white rounded-2xl border border-gray-100 shadow-card p-5', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
          {subValue && <p className="text-xs text-gray-400 mt-0.5">{subValue}</p>}
          {change !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={cn('flex items-center gap-1 text-xs font-semibold', isPositive ? 'text-emerald-600' : 'text-red-500')}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(change).toFixed(1)}%
              </span>
              {changeLabel && <span className="text-xs text-gray-400">{changeLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl ml-3 flex-shrink-0" style={{ background: iconStyle.bg, color: iconStyle.color }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
