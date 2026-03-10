'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { StatsCard } from '@/components/ui/StatsCard'
import { Button } from '@/components/ui/Button'
import { mockMonthlyRevenue, mockPlatformBreakdown, mockDeposits } from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts'
import { TrendingUp, DollarSign, TrendingDown, Download } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ReportsPage() {
  const [period, setPeriod] = useState<'monthly' | 'quarterly'>('monthly')

  const totalRevenue = mockMonthlyRevenue.reduce((s, m) => s + m.revenue, 0)
  const totalExpenses = mockMonthlyRevenue.reduce((s, m) => s + m.expenses, 0)
  const totalProfit = mockMonthlyRevenue.reduce((s, m) => s + m.profit, 0)
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1)

  const quarterlyData = [
    { quarter: 'Q1', revenue: mockMonthlyRevenue.slice(0, 3).reduce((s, m) => s + m.revenue, 0), expenses: mockMonthlyRevenue.slice(0, 3).reduce((s, m) => s + m.expenses, 0), profit: mockMonthlyRevenue.slice(0, 3).reduce((s, m) => s + m.profit, 0) },
    { quarter: 'Q2', revenue: mockMonthlyRevenue.slice(3, 6).reduce((s, m) => s + m.revenue, 0), expenses: mockMonthlyRevenue.slice(3, 6).reduce((s, m) => s + m.expenses, 0), profit: mockMonthlyRevenue.slice(3, 6).reduce((s, m) => s + m.profit, 0) },
    { quarter: 'Q3', revenue: mockMonthlyRevenue.slice(6, 9).reduce((s, m) => s + m.revenue, 0), expenses: mockMonthlyRevenue.slice(6, 9).reduce((s, m) => s + m.expenses, 0), profit: mockMonthlyRevenue.slice(6, 9).reduce((s, m) => s + m.profit, 0) },
    { quarter: 'Q4', revenue: mockMonthlyRevenue.slice(9, 12).reduce((s, m) => s + m.revenue, 0), expenses: mockMonthlyRevenue.slice(9, 12).reduce((s, m) => s + m.expenses, 0), profit: mockMonthlyRevenue.slice(9, 12).reduce((s, m) => s + m.profit, 0) },
  ]

  type ChartEntry = { name: string; revenue: number; expenses: number; profit: number }
  const chartData: ChartEntry[] = period === 'monthly'
    ? mockMonthlyRevenue.map(m => ({ name: m.month, revenue: m.revenue, expenses: m.expenses, profit: m.profit }))
    : quarterlyData.map(q => ({ name: q.quarter, revenue: q.revenue, expenses: q.expenses, profit: q.profit }))

  const totalDeposited = mockDeposits.filter(d => d.status === 'confirmed').reduce((s, d) => s + d.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Revenue, expenses and profit analysis</p>
        </div>
        <Button variant="outline" icon={<Download className="w-4 h-4" />} onClick={() => toast.success('Report exported')}>Export</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard variant="hero" label="Total Revenue" value={formatCurrency(totalRevenue)} change={8.4} changeLabel="vs last year" icon={<DollarSign className="w-5 h-5 text-white" />} />
        <StatsCard label="Total Expenses" value={formatCurrency(totalExpenses)} change={-3.1} changeLabel="vs last year" icon={<TrendingDown className="w-5 h-5" />} variant="default" />
        <StatsCard label="Net Profit" value={formatCurrency(totalProfit)} change={14.2} changeLabel="vs last year" icon={<TrendingUp className="w-5 h-5" />} variant="blue" />
        <StatsCard label="Profit Margin" value={`${profitMargin}%`} change={2.1} changeLabel="vs last year" icon={<TrendingUp className="w-5 h-5" />} variant="amber" />
      </div>

      {/* Revenue vs Expenses chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Revenue vs Expenses vs Profit</h2>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {(['monthly', 'quarterly'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-all ${period === p ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [formatCurrency(Number(v)), '']} />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#fca5a5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Profit" fill="#6ee7b7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Profit trend line */}
      <Card>
        <CardHeader><h2 className="font-semibold text-gray-900">Profit Trend</h2></CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockMonthlyRevenue.map(m => ({ name: m.month, profit: m.profit }))} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [formatCurrency(Number(v)), 'Profit']} />
              <Line type="monotone" dataKey="profit" stroke="#059669" strokeWidth={2.5} dot={{ fill: '#059669', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Platform breakdown + deposits summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">Revenue by Platform</h2></CardHeader>
          <CardBody className="space-y-3">
            {mockPlatformBreakdown.map(p => {
              const pct = ((p.amount / mockPlatformBreakdown.reduce((s, x) => s + x.amount, 0)) * 100).toFixed(0)
              return (
                <div key={p.platform}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">{p.platform}</span>
                    <span className="text-gray-500">{formatCurrency(p.amount)} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: p.color }} />
                  </div>
                </div>
              )
            })}
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">Bank Deposits Summary</h2></CardHeader>
          <CardBody>
            <div className="text-center py-4 mb-4 bg-primary-50 rounded-xl">
              <p className="text-3xl font-bold text-primary-700">{formatCurrency(totalDeposited)}</p>
              <p className="text-sm text-primary-500 mt-1">Total Confirmed Deposits</p>
            </div>
            <div className="space-y-2">
              {mockDeposits.slice(0, 5).map(d => (
                <div key={d.id} className="flex justify-between text-sm py-2 border-b border-gray-50">
                  <span className="text-gray-600">{d.bank}</span>
                  <span className="font-medium text-gray-900">{formatCurrency(d.amount)}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
