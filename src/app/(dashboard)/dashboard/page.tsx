'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { StatsCard } from '@/components/ui/StatsCard'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  mockMonthlyRevenue,
  mockPlatformBreakdown,
  mockCODEntries,
  mockDrivers,
  mockEmployees,
  mockAlerts,
  mockAttendance,
  mockComplianceDocs,
} from '@/lib/mockData'
import { formatCurrency, formatCurrencyShort, formatDate } from '@/lib/utils'
import {
  DollarSign, Truck, Users, TrendingUp, AlertTriangle,
  CheckCircle, Info, Clock, Package,
} from 'lucide-react'

// ─── CEO / Super‑Admin Dashboard ────────────────────────────────────────────

const CHART_GRAD_ID = 'revenueGradient'

function CEODashboard() {
  const totalRevenue = mockMonthlyRevenue.reduce((s, m) => s + m.revenue, 0)
  const activeDrivers = mockDrivers.filter(d => d.status === 'active').length
  const deliveriesToday = 1_243
  const platformCollections = mockPlatformBreakdown.reduce((s, p) => s + p.amount, 0)

  // For the right column — platform breakdown percentages
  const totalPlatformAmt = mockPlatformBreakdown.reduce((s, p) => s + p.amount, 0)

  return (
    <div className="space-y-6 animate-in">
      {/* ── 4 Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          label="Total Revenue (BHD)"
          value={formatCurrency(totalRevenue)}
          change={8.4}
          changeAmount="+BD 2,156.000"
          changeLabel="from last month"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <StatsCard
          label="Deliveries Today"
          value={deliveriesToday.toLocaleString()}
          change={12.5}
          changeAmount="+138"
          changeLabel="from yesterday"
          icon={<Truck className="w-4 h-4" />}
        />
        <StatsCard
          label="Active Drivers"
          value={activeDrivers}
          change={3.2}
          changeAmount={`+${Math.round(activeDrivers * 0.032)}`}
          changeLabel="from last month"
          icon={<Users className="w-4 h-4" />}
        />
        <StatsCard
          label="Platform Collections"
          value={formatCurrencyShort(platformCollections)}
          change={-2.1}
          changeAmount="-BD 820.000"
          changeLabel="from last month"
          icon={<Package className="w-4 h-4" />}
        />
      </div>

      {/* ── Main content: chart + right column ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Overall Performance area chart — 2/3 width */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Overall Performance</h3>
                <p className="text-xs text-gray-400 mt-0.5">Revenue trend — last 7 months</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#22c55e' }} />
                  Revenue
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full inline-block bg-gray-200" />
                  Expenses
                </span>
              </div>
            </CardHeader>
            <CardBody className="pt-2">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart
                  data={mockMonthlyRevenue}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id={CHART_GRAD_ID} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#e2e8f0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
                    width={34}
                  />
                  <Tooltip
                    formatter={(v, name) => [formatCurrency(Number(v)), name === 'revenue' ? 'Revenue' : 'Expenses']}
                    contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #f1f5f9' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#e2e8f0"
                    strokeWidth={2}
                    fill="url(#expensesGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    fill={`url(#${CHART_GRAD_ID})`}
                    dot={{ r: 3.5, fill: '#22c55e', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* Right column: platform breakdown + summary stats — 1/3 width */}
        <div className="space-y-4">
          {/* Platform breakdown card */}
          <Card>
            <CardHeader>
              <h3 className="text-sm font-bold text-gray-900">Platform Breakdown</h3>
            </CardHeader>
            <CardBody className="space-y-3">
              {mockPlatformBreakdown.map(p => {
                const pct = Math.round((p.amount / totalPlatformAmt) * 100)
                return (
                  <div key={p.platform}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                        <span className="text-sm text-gray-700 font-medium">{p.platform}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: `${pct}%`, background: p.color }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{formatCurrencyShort(p.amount)} · {p.deliveries.toLocaleString()} deliveries</p>
                  </div>
                )
              })}
            </CardBody>
          </Card>

          {/* Quick stats summary */}
          <Card>
            <CardHeader>
              <h3 className="text-sm font-bold text-gray-900">Quick Summary</h3>
            </CardHeader>
            <CardBody className="space-y-3 py-3">
              {[
                { label: 'Avg. Revenue / Driver', value: formatCurrencyShort(totalRevenue / activeDrivers), color: '#22c55e' },
                { label: 'Pending COD', value: formatCurrencyShort(mockCODEntries.filter(c => c.status === 'pending').reduce((s, c) => s + c.amount, 0)), color: '#f59e0b' },
                { label: 'Total Employees', value: mockEmployees.length.toString(), color: '#14B8A6' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-xs text-gray-500">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* ── Recent Alerts ── */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-bold text-gray-900">Recent Alerts</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-500">
            {mockAlerts.filter(a => a.type === 'error' || a.type === 'warning').length} attention needed
          </span>
        </CardHeader>
        <CardBody className="divide-y divide-gray-50 py-0">
          {mockAlerts.map(alert => (
            <div key={alert.id} className="flex items-start gap-3 py-3">
              {alert.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />}
              {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />}
              {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />}
              {alert.type === 'info' && <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">{alert.message}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{alert.time}</span>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  )
}

// ─── Finance Dashboard ───────────────────────────────────────────────────────

function FinanceDashboard() {
  const totalBalance = mockPlatformBreakdown.reduce((s, p) => s + p.amount, 0)
  const pendingCOD = mockCODEntries.filter(c => c.status === 'pending').reduce((s, c) => s + c.amount, 0)
  const monthRevenue = mockMonthlyRevenue[mockMonthlyRevenue.length - 1]?.revenue || 0

  return (
    <div className="space-y-6 animate-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          variant="hero"
          label="Total Balance"
          value={formatCurrency(totalBalance)}
          change={5.2}
          changeLabel="vs last month"
          icon={<DollarSign className="w-5 h-5 text-white" />}
        />
        <StatsCard
          label="Monthly Revenue"
          value={formatCurrency(monthRevenue)}
          change={3.8}
          changeAmount="+BD 1,240.000"
          changeLabel="from last month"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatsCard
          label="COD Pending"
          value={formatCurrency(pendingCOD)}
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Platform balances */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {mockPlatformBreakdown.map(p => (
          <div key={p.platform} className="bg-white rounded-xl shadow-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
              <span className="text-sm font-medium text-gray-700">{p.platform}</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(p.amount)}</p>
            <p className="text-xs text-gray-500 mt-1">{p.deliveries.toLocaleString()} deliveries</p>
          </div>
        ))}
      </div>

      {/* Cash Flow chart */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-bold text-gray-900">Cash Flow — Last 7 Months</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={mockMonthlyRevenue} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} width={34} />
              <Tooltip formatter={(v) => [formatCurrency(Number(v)), '']} />
              <Bar dataKey="revenue" name="Revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#fca5a5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Profit" fill="#86efac" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Recent COD entries */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-bold text-gray-900">Recent COD Entries</h3>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Driver', 'Platform', 'Amount', 'Date', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockCODEntries.slice(0, 8).map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-700">{entry.driverName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{entry.platform}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(entry.amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(entry.date)}</td>
                  <td className="px-4 py-3"><StatusBadge status={entry.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ─── HR Dashboard ────────────────────────────────────────────────────────────

function HRDashboard() {
  const totalStaff = mockEmployees.length
  const presentToday = mockAttendance.filter(a => a.status === 'present').length
  const onLeave = mockAttendance.filter(a => a.status === 'on_leave').length
  const newThisMonth = mockEmployees.filter(e => e.joinDate.startsWith('2024-01')).length

  return (
    <div className="space-y-6 animate-in">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          variant="hero"
          label="Total Staff"
          value={totalStaff}
          icon={<Users className="w-5 h-5 text-white" />}
        />
        <StatsCard
          label="Present Today"
          value={presentToday}
          change={2.1}
          changeLabel="vs yesterday"
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <StatsCard
          label="On Leave"
          value={onLeave}
          icon={<Clock className="w-5 h-5" />}
        />
        <StatsCard
          label="New This Month"
          value={newThisMonth}
          change={0}
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-sm font-bold text-gray-900">Today&apos;s Attendance</h3>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Employee', 'Department', 'Check In', 'Check Out', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockAttendance.slice(0, 10).map(rec => (
                <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">{rec.employeeName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{rec.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{rec.checkIn || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{rec.checkOut || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={rec.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ─── Legal Dashboard ─────────────────────────────────────────────────────────

function LegalDashboard() {
  const active = mockComplianceDocs.filter(d => d.status === 'active').length
  const expiringSoon = mockComplianceDocs.filter(d => d.status === 'expiring_soon').length
  const expired = mockComplianceDocs.filter(d => d.status === 'expired').length

  return (
    <div className="space-y-6 animate-in">
      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          variant="hero"
          label="Active Documents"
          value={active}
          icon={<CheckCircle className="w-5 h-5 text-white" />}
        />
        <StatsCard
          label="Expiring Soon"
          value={expiringSoon}
          icon={<Clock className="w-5 h-5" />}
        />
        <StatsCard
          label="Expired"
          value={expired}
          change={-100}
          icon={<AlertTriangle className="w-5 h-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-sm font-bold text-gray-900">Compliance Documents</h3>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Document', 'Type', 'Expiry Date', 'Uploaded By', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockComplianceDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">{doc.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{doc.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(doc.expiryDate)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{doc.uploadedBy}</td>
                  <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ─── Page entry point ────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { role } = useAuth()

  if (role === 'finance') return <FinanceDashboard />
  if (role === 'hr') return <HRDashboard />
  if (role === 'legal') return <LegalDashboard />
  return <CEODashboard />
}
