'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { StatsCard } from '@/components/ui/StatsCard'
import { mockAttendance } from '@/lib/mockData'
import { formatDate } from '@/lib/utils'
import { Users, UserCheck, UserX, Clock, Search } from 'lucide-react'

export default function AttendancePage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = mockAttendance.filter(r => {
    const matchSearch = r.employeeName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const present = mockAttendance.filter(r => r.status === 'present').length
  const absent = mockAttendance.filter(r => r.status === 'absent').length
  const late = mockAttendance.filter(r => r.status === 'late').length
  const onLeave = mockAttendance.filter(r => r.status === 'on_leave').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-500 text-sm mt-1">Daily attendance tracking for all employees</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard variant="hero" label="Present Today" value={present} icon={<UserCheck className="w-5 h-5 text-white" />} />
        <StatsCard label="Absent" value={absent} icon={<UserX className="w-5 h-5" />} variant="default" />
        <StatsCard label="Late" value={late} icon={<Clock className="w-5 h-5" />} variant="amber" />
        <StatsCard label="On Leave" value={onLeave} icon={<Users className="w-5 h-5" />} variant="blue" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search employee..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="on_leave">On Leave</option>
              <option value="half_day">Half Day</option>
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
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Check In</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Check Out</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{r.employeeName}</td>
                    <td className="px-6 py-4 text-gray-500">{r.department}</td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(r.date)}</td>
                    <td className="px-6 py-4 text-gray-700 font-mono text-xs">{r.checkIn || '—'}</td>
                    <td className="px-6 py-4 text-gray-700 font-mono text-xs">{r.checkOut || '—'}</td>
                    <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">No records found</div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
