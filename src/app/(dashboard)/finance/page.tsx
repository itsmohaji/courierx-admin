'use client'

import React, { useState, useMemo } from 'react'
import { StatsCard } from '@/components/ui/StatsCard'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { DataTable, Column } from '@/components/ui/Table'
import { StatusBadge } from '@/components/ui/Badge'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { mockMonthlyRevenue, mockPlatformBreakdown, mockCODEntries, mockDeposits } from '@/lib/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import type { CODEntry } from '@/types'

export default function FinancePage() {
  const [platform, setPlatform] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const totalRevenue = mockMonthlyRevenue.reduce((s, m) => s + m.revenue, 0)
  const totalCODCollected = mockCODEntries.filter(c => c.status === 'approved').reduce((s, c) => s + c.amount, 0)
  const pendingCOD = mockCODEntries.filter(c => c.status === 'pending').reduce((s, c) => s + c.amount, 0)
  const totalDeposits = mockDeposits.filter(d => d.status === 'confirmed').reduce((s, d) => s + d.amount, 0)

  const filteredCOD = useMemo(() => {
    return mockCODEntries.filter(e => {
      if (platform !== 'All' && e.platform !== platform) return false
      if (statusFilter !== 'All' && e.status !== statusFilter) return false
      return true
    })
  }, [platform, statusFilter])

  const columns: Column<CODEntry>[] = [
    {
      key: 'driver',
      header: 'Driver',
      accessor: (r) => <span className="font-medium text-gray-800">{r.driverName}</span>,
      sortable: true,
      sortValue: (r) => r.driverName,
    },
    { key: 'platform', header: 'Platform', accessor: (r) => r.platform, sortable: true, sortValue: (r) => r.platform },
    {
      key: 'amount',
      header: 'Amount',
      accessor: (r) => <span className="font-semibold text-gray-900">{formatCurrency(r.amount)}</span>,
      sortable: true,
      sortValue: (r) => r.amount,
    },
    { key: 'date', header: 'Date', accessor: (r) => formatDate(r.date), sortable: true, sortValue: (r) => r.date },
    { key: 'batch', header: 'Batch', accessor: (r) => <span className="text-xs text-gray-500">{r.batchId}</span> },
    { key: 'status', header: 'Status', accessor: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Finance Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Financial performance and cash flow analysis</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          variant="hero"
          label="Total Revenue (YTD)"
          value={formatCurrency(totalRevenue)}
          change={8.4}
          changeLabel="vs last year"
          icon={<DollarSign className="w-5 h-5 text-white" />}
        />
        <StatsCard
          label="COD Collected"
          value={formatCurrency(totalCODCollected)}
          change={5.1}
          changeLabel="this month"
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <StatsCard
          label="Deposits Made"
          value={formatCurrency(totalDeposits)}
          change={2.8}
          changeLabel="this month"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatsCard
          label="Pending COD"
          value={formatCurrency(pendingCOD)}
          variant="amber"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-gray-900">Monthly Revenue vs Expenses</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockMonthlyRevenue} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), '']} />
                <Bar dataKey="revenue" name="Revenue" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#fca5a5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#6ee7b7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-gray-900">COD by Platform</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={mockPlatformBreakdown}
                  dataKey="amount"
                  nameKey="platform"
                  cx="50%"
                  cy="45%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={3}
                >
                  {mockPlatformBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [formatCurrency(v), 'Amount']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Transactions table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h3 className="text-sm font-semibold text-gray-900">COD Transactions</h3>
            <div className="flex flex-wrap gap-2 sm:ml-auto">
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {['All', 'Keeta', 'Jahez', 'Ninja', 'Noon'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {['All', 'pending', 'approved', 'rejected'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0 px-0">
          <DataTable
            data={filteredCOD as unknown as Record<string, unknown>[]}
            columns={columns as unknown as Column<Record<string, unknown>>[]}
            searchable
            searchPlaceholder="Search driver or platform..."
            searchKeys={['driverName', 'platform'] as never[]}
            exportable
            exportFileName="cod-transactions"
            pageSize={8}
          />
        </CardBody>
      </Card>
    </div>
  )
}
