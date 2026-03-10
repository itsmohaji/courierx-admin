'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatsCard } from '@/components/ui/StatsCard'
import { Button } from '@/components/ui/Button'
import { mockTickets } from '@/lib/mockData'
import { formatDate } from '@/lib/utils'
import { FileText, Search, Plus, AlertCircle } from 'lucide-react'
import type { Ticket } from '@/types'

const priorityColors: Record<Ticket['priority'], 'gray' | 'blue' | 'amber' | 'red'> = {
  low: 'gray',
  medium: 'blue',
  high: 'amber',
  critical: 'red',
}

const statusColors: Record<Ticket['status'], 'blue' | 'amber' | 'green' | 'gray'> = {
  open: 'blue',
  in_progress: 'amber',
  resolved: 'green',
  closed: 'gray',
}

export default function DocumentsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = mockTickets.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.reporter.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    return matchSearch && matchStatus
  })

  const open = mockTickets.filter(t => t.status === 'open').length
  const inProgress = mockTickets.filter(t => t.status === 'in_progress').length
  const resolved = mockTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
  const critical = mockTickets.filter(t => t.priority === 'critical').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Legal Documents & Tickets</h1>
          <p className="text-gray-500 text-sm mt-1">Manage legal cases, contracts and support tickets</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>New Ticket</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard variant="hero" label="Total Tickets" value={mockTickets.length} icon={<FileText className="w-5 h-5 text-white" />} />
        <StatsCard label="Open" value={open} icon={<AlertCircle className="w-5 h-5" />} variant="blue" />
        <StatsCard label="In Progress" value={inProgress} icon={<AlertCircle className="w-5 h-5" />} variant="amber" />
        <StatsCard label="Critical" value={critical} icon={<AlertCircle className="w-5 h-5" />} variant="default" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tickets..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Title</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Reporter</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Assignee</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Priority</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Created</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 max-w-xs truncate">{t.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{t.description}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{t.reporter}</td>
                    <td className="px-6 py-4 text-gray-600">{t.assignee}</td>
                    <td className="px-6 py-4">
                      <Badge variant={priorityColors[t.priority]}>{t.priority}</Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(t.createdAt)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusColors[t.status]}>{t.status.replace('_', ' ')}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">No tickets found</div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
