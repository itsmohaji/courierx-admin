'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { StatsCard } from '@/components/ui/StatsCard'
import { Button } from '@/components/ui/Button'
import { mockEmployees } from '@/lib/mockData'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { Users, UserCheck, UserX, Search, Plus } from 'lucide-react'
import type { Employee } from '@/types'

export default function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [selected, setSelected] = useState<Employee | null>(null)

  const departments = ['all', ...Array.from(new Set(mockEmployees.map(e => e.department)))]

  const filtered = mockEmployees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === 'all' || e.department === deptFilter
    return matchSearch && matchDept
  })

  const active = mockEmployees.filter(e => e.status === 'active').length
  const onLeave = mockEmployees.filter(e => e.status === 'on_leave').length
  const inactive = mockEmployees.filter(e => e.status === 'inactive').length
  const totalPayroll = mockEmployees.filter(e => e.status === 'active').reduce((s, e) => s + e.salary, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all staff members</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Add Employee</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard variant="hero" label="Total Employees" value={mockEmployees.length} icon={<Users className="w-5 h-5 text-white" />} />
        <StatsCard label="Active" value={active} icon={<UserCheck className="w-5 h-5" />} variant="default" />
        <StatsCard label="On Leave" value={onLeave} icon={<Users className="w-5 h-5" />} variant="amber" />
        <StatsCard label="Monthly Payroll" value={formatCurrency(totalPayroll)} icon={<UserX className="w-5 h-5" />} variant="blue" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search employees..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>
              ))}
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
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Position</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Salary</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Join Date</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(emp => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelected(emp)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm flex-shrink-0">
                          {getInitials(emp.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{emp.department}</td>
                    <td className="px-6 py-4 text-gray-600">{emp.position}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(emp.salary)}</td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(emp.joinDate)}</td>
                    <td className="px-6 py-4"><StatusBadge status={emp.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">No employees found</div>
            )}
          </div>
        </CardBody>
      </Card>

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
                {getInitials(selected.name)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                <p className="text-gray-500">{selected.position}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ['Email', selected.email],
                ['Phone', selected.phone],
                ['Department', selected.department],
                ['Salary', formatCurrency(selected.salary)],
                ['Join Date', formatDate(selected.joinDate)],
                ['Status', selected.status],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900">{val}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelected(null)} className="mt-6 w-full py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
