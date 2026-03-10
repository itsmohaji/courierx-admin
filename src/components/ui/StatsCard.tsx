import React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  changeAmount?: string
  icon?: React.ReactNode
  variant?: 'default' | 'hero' | 'teal' | 'amber' | 'red' | 'blue'
  className?: string
  subValue?: string
}

export function StatsCard({
  label,
  value,
  change,
  changeLabel,
  changeAmount,
  icon,
  variant = 'default',
  className,
  subValue,
}: StatsCardProps) {
  const isPositive = (change || 0) >= 0

  if (variant === 'hero') {
    return (
      <div
        className={cn('rounded-xl p-5 text-white relative overflow-hidden shadow-card', className)}
        style={{ background: 'linear-gradient(135deg, var(--sidebar-bg) 0%, #1C4229 100%)' }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-8 translate-x-8" style={{ background: 'var(--accent)' }} />
        <div className="relative">
          {icon && (
            <div className="inline-flex p-2 rounded-xl mb-3" style={{ background: 'rgba(20,184,166,0.2)' }}>
              {icon}
            </div>
          )}
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</p>
          <div className="flex items-center gap-3 mb-1">
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {change !== undefined && (
              <span
                className="flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: isPositive ? 'rgba(20,184,166,0.25)' : 'rgba(239,68,68,0.25)',
                  color: isPositive ? '#5EEAD4' : '#FCA5A5',
                }}
              >
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(change).toFixed(1)}%
              </span>
            )}
          </div>
          {(changeAmount || changeLabel) && (
            <p className="text-xs flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {changeAmount && <span>{changeAmount}</span>}
              {changeLabel && <span>{changeLabel}</span>}
              <ArrowUpRight className="w-3 h-3" />
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-xl shadow-card p-5', className)}>
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 leading-none pt-0.5">{label}</p>
        {icon && (
          <div
            className="p-2.5 rounded-xl flex-shrink-0"
            style={{ background: '#CCFBF1', color: 'var(--accent-dark)' }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Value + % badge */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <p className="text-2xl font-bold text-gray-900 tracking-tight leading-none">{value}</p>
        {change !== undefined && (
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full',
              isPositive
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-500',
            )}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>

      {/* Bottom: change amount from last month */}
      {(changeAmount || changeLabel || subValue) && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          {changeAmount && (
            <span className={isPositive ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'}>
              {changeAmount}
            </span>
          )}
          {changeLabel && <span>{changeLabel}</span>}
          {subValue && !changeAmount && <span>{subValue}</span>}
          {(changeAmount || changeLabel) && <ArrowUpRight className="w-3 h-3" />}
        </p>
      )}
    </div>
  )
}
