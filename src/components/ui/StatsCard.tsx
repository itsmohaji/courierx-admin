import React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  variant?: 'hero' | 'default' | 'blue' | 'purple' | 'amber'
  className?: string
  subValue?: string
}

export function StatsCard({
  label,
  value,
  change,
  changeLabel,
  icon,
  variant = 'default',
  className,
  subValue,
}: StatsCardProps) {
  const isPositive = (change || 0) >= 0

  if (variant === 'hero') {
    return (
      <div
        className={cn(
          'rounded-2xl p-6 text-white relative overflow-hidden',
          'bg-gradient-to-br from-primary-600 to-primary-800',
          className
        )}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-4" />
        <div className="relative">
          {icon && (
            <div className="inline-flex p-2.5 bg-white/20 rounded-xl mb-4">
              {icon}
            </div>
          )}
          <p className="text-sm font-medium text-white/80 mb-1">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subValue && <p className="text-sm text-white/70 mt-1">{subValue}</p>}
          {change !== undefined && (
            <div className="flex items-center gap-1.5 mt-3">
              <div className={cn(
                'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                isPositive ? 'bg-white/20 text-white' : 'bg-red-400/30 text-red-100'
              )}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(change).toFixed(1)}%
              </div>
              {changeLabel && <span className="text-xs text-white/60">{changeLabel}</span>}
            </div>
          )}
        </div>
      </div>
    )
  }

  const colorMap = {
    default: { bg: 'bg-white', iconBg: 'bg-primary-50', iconColor: 'text-primary-600' },
    blue: { bg: 'bg-white', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    purple: { bg: 'bg-white', iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
    amber: { bg: 'bg-white', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  }

  const colors = colorMap[variant as keyof typeof colorMap] || colorMap.default

  return (
    <div className={cn('rounded-xl border border-gray-100 shadow-sm p-5', colors.bg, className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-medium truncate">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">{value}</p>
          {subValue && <p className="text-sm text-gray-500 mt-0.5">{subValue}</p>}
          {change !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className={cn(
                'flex items-center gap-1 text-xs font-medium',
                isPositive ? 'text-emerald-600' : 'text-red-600'
              )}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(change).toFixed(1)}%
              </div>
              {changeLabel && <span className="text-xs text-gray-400">{changeLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('flex-shrink-0 p-2.5 rounded-xl ml-3', colors.iconBg, colors.iconColor)}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
