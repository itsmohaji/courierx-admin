'use client'

import React, { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { StatsCard } from '@/components/ui/StatsCard'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
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
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  DollarSign, Truck, Users, TrendingUp, AlertTriangle,
  CheckCircle, Info, Clock,
} from 'lucide-react'

function CEODashboard() {
  const totalRevenue = mockMonthlyRevenue.reduce((s, m) => s + m.revenue, 0)
  const activeDrivers = mockDrivers.filter(d => d.status === 'active').length
  const pendingCOD = mockCODEntries.filter(c => c.status === 'pending').reduce((s, c) => s + c.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Company performance overview</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatsCard
          variant="hero"
          label="Total Revenue (YTD)"
          value={formatCurrency(totalRevenue)}
          change={8.4}
          changeLabel="vs last year"
          icon={<DollarSign className="w-5 h-5 text-white" />}
        />
        <StatsCard
          label="Active Deliveries"
          value="1,243"
          change={12.5}
          changeLabel="this week"
          icon={<Truck className="w-5 h-5" />}
        />
        <StatsCard
          label="Active Drivers"
          value={activeDrivers}
          change={3.2}
          changeLabel="this month"
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-gray-900">Monthly Cash Flow</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockMonthlyRevenue} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), '']} />
                <Bar dataKey="revenue" name="Revenue" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Platform breakdown */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-gray-900">Platform Breakdown</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={mockPlatformBreakdown}
                  dataKey="amount"
                  nameKey="platform"
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  innerRadius={55}
                  paddingAngle={3}
                  label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {mockPlatformBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [formatCurrency(v), 'Revenue']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-gray-900">Recent Alerts</h3>
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

function FinanceDashboard() {
  const totalBalance = mockPlatformBreakdown.reduce((s, p) => s + p.amount, 0)
  const pendingCOD = mockCODEntries.filter(c => c.status === 'pending').reduce((s, c) => s + c.amount, 0)
  const monthRevenue = mockMonthlyRevenue[mockMonthlyRevenue.length - 1]?.revenue || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Financial overview and cash flow</p>
      </div>

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
          changeLabel="vs last month"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatsCard
          label="COD Pending"
          value={formatCurrency(pendingCOD)}
          icon={<Clock className="w-5 h-5" />}
          variant="amber"
        />
      </div>

      {/* Platform balances */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {mockPlatformBreakdown.map(p => (
          <div key={p.platform} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
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
          <h3 className="text-sm font-semibold text-gray-900">Cash Flow — Last 7 Months</h3>
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
              <Bar dataKey="profit" name="Profit" fill="#86efac" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Recent COD entries */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-gray-900">Recent COD Entries</h3>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Driver', 'Platform', 'Amount', 'Date', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockCODEntries.slice(0, 8).map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50">
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

function HRDashboard() {
  const totalStaff = mockEmployees.length
  const presentToday = mockAttendance.filter(a => a.status === 'present').length
  const onLeave = mockAttendance.filter(a => a.status === 'on_leave').length
  const newThisMonth = mockEmployees.filter(e => e.joinDate.startsWith('2024-01')).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Human resources overview</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard variant="hero" label="Total Staff" value={totalStaff} icon={<Users className="w-5 h-5 text-white" />} />
        <StatsCard label="Present Today" value={presentToday} change={2.1} changeLabel="vs yesterday" icon={<CheckCircle className="w-5 h-5" />} />
        <StatsCard label="On Leave" value={onLeave} variant="amber" icon={<Clock className="w-5 h-5" />} />
        <StatsCard label="New This Month" value={newThisMonth} variant="blue" icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-gray-900">Today&apos;s Attendance</h3>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Employee', 'Department', 'Check In', 'Check Out', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockAttendance.slice(0, 10).map(rec => (
                <tr key={rec.id} className="hover:bg-gray-50">
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

function LegalDashboard() {
  const active = mockComplianceDocs.filter(d => d.status === 'active').length
  const expiringSoon = mockComplianceDocs.filter(d => d.status === 'expiring_soon').length
  const expired = mockComplianceDocs.filter(d => d.status === 'expired').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Legal Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Compliance and documents overview</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatsCard variant="hero" label="Active Documents" value={active} icon={<CheckCircle className="w-5 h-5 text-white" />} />
        <StatsCard label="Expiring Soon" value={expiringSoon} variant="amber" icon={<Clock className="w-5 h-5" />} />
        <StatsCard label="Expired" value={expired} variant="amber" icon={<AlertTriangle className="w-5 h-5" />} />
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-gray-900">Compliance Documents</h3>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Document', 'Type', 'Expiry Date', 'Uploaded By', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockComplianceDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50">
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

export default function DashboardPage() {
  const { role } = useAuth()

  if (role === 'finance') return <FinanceDashboard />
  if (role === 'hr') return <HRDashboard />
  if (role === 'legal') return <LegalDashboard />
  return <CEODashboard />
}
