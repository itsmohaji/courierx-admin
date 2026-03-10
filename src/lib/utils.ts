import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Bahraini Dinar (BD) — 3 decimal places
export function formatCurrency(amount: number) {
  return `BD ${new Intl.NumberFormat('en-BH', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount)}`
}

export function formatCurrencyShort(amount: number) {
  if (amount >= 1_000_000) return `BD ${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `BD ${(amount / 1_000).toFixed(1)}K`
  return formatCurrency(amount)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat('en-BH').format(num)
}

export function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-')
}

export function calculatePercentChange(current: number, previous: number) {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

// COD math: gross → platform fee → tax → net payout
export function calcCODBreakdown(gross: number, feeRate: number, taxRate = 0.1) {
  const platformFee = parseFloat((gross * feeRate).toFixed(3))
  const tax = parseFloat((platformFee * taxRate).toFixed(3))
  const net = parseFloat((gross - platformFee - tax).toFixed(3))
  return { gross, platformFee, tax, net }
}
