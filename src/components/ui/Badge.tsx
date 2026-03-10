import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'gray' | 'orange'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'gray', children, className }: BadgeProps) {
  const variants = {
    green: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
    red: 'bg-red-100 text-red-700 ring-red-600/20',
    amber: 'bg-amber-100 text-amber-700 ring-amber-600/20',
    blue: 'bg-blue-100 text-blue-700 ring-blue-600/20',
    purple: 'bg-purple-100 text-purple-700 ring-purple-600/20',
    gray: 'bg-gray-100 text-gray-600 ring-gray-500/20',
    orange: 'bg-orange-100 text-orange-700 ring-orange-600/20',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

// Convenience helpers
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    active: { variant: 'green', label: 'Active' },
    inactive: { variant: 'gray', label: 'Inactive' },
    suspended: { variant: 'red', label: 'Suspended' },
    on_leave: { variant: 'amber', label: 'On Leave' },
    pending: { variant: 'amber', label: 'Pending' },
    approved: { variant: 'green', label: 'Approved' },
    rejected: { variant: 'red', label: 'Rejected' },
    confirmed: { variant: 'green', label: 'Confirmed' },
    failed: { variant: 'red', label: 'Failed' },
    open: { variant: 'blue', label: 'Open' },
    in_progress: { variant: 'purple', label: 'In Progress' },
    resolved: { variant: 'green', label: 'Resolved' },
    closed: { variant: 'gray', label: 'Closed' },
    low: { variant: 'gray', label: 'Low' },
    medium: { variant: 'amber', label: 'Medium' },
    high: { variant: 'orange', label: 'High' },
    critical: { variant: 'red', label: 'Critical' },
    expired: { variant: 'red', label: 'Expired' },
    expiring_soon: { variant: 'amber', label: 'Expiring Soon' },
    paid: { variant: 'green', label: 'Paid' },
    processed: { variant: 'blue', label: 'Processed' },
    present: { variant: 'green', label: 'Present' },
    absent: { variant: 'red', label: 'Absent' },
    late: { variant: 'amber', label: 'Late' },
    half_day: { variant: 'orange', label: 'Half Day' },
    applied: { variant: 'blue', label: 'Applied' },
    screening: { variant: 'purple', label: 'Screening' },
    interview: { variant: 'amber', label: 'Interview' },
    offer: { variant: 'orange', label: 'Offer' },
    hired: { variant: 'green', label: 'Hired' },
  }

  const config = map[status] || { variant: 'gray' as const, label: status }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
