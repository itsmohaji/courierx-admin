'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { StatsCard } from '@/components/ui/StatsCard'
import { Button } from '@/components/ui/Button'
import { mockPayroll } from '@/lib/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DollarSign, CheckCircle, Clock, Search } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PayrollPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [records, setRecords] = useState(mockPayroll)

  const filtered = records.filter(r => {
    const matchSearch = r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPayroll = records.reduce((s, r) => s + r.netSalary, 0)
  const paid = records.filter(r => r.status === 'paid').length
  const pending = records.filter(r => r.status === 'pending').length
  const processed = records.filter(r => r.status === 'processed').length

  const processAll = () => {
    setRecords(prev => prev.map(r => r.status === 'pending' ? { ...r, status: 'processed' as const } : r))
    toast.success('All pending payroll records processed')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
          <p className="text-gray-500 text-sm mt-1">Salary management and processing</p>
        </div>
        <Button variant="primary" onClick={processAll}>Process All Pending</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard variant="hero" label="Total Payroll" value={formatCurrency(totalPayroll)} icon={<DollarSign className="w-5 h-5 text-white" />} />
        <StatsCard label="Paid" value={paid} icon={<CheckCircle className="w-5 h-5" />} variant="default" />
        <StatsCard label="Processed" value={processed} icon={<Clock className="w-5 h-5" />} variant="blue" />
        <StatsCard label="Pending" value={pending} icon={<Clock className="w-5 h-5" />} variant="amber" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search employee or department..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Employee</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Department</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Base Salary</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Overtime</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Deductions</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Net Salary</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Month</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{r.employeeName}</td>
                    <td className="px-6 py-4 text-gray-500">{r.department}</td>
                    <td className="px-6 py-4 text-gray-700">{formatCurrency(r.baseSalary)}</td>
                    <td className="px-6 py-4 text-emerald-600">+{formatCurrency(r.overtime)}</td>
                    <td className="px-6 py-4 text-red-500">-{formatCurrency(r.deductions)}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{formatCurrency(r.netSalary)}</td>
                    <td className="px-6 py-4 text-gray-500">{r.month}</td>
                    <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">No payroll records found</div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
