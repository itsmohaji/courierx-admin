'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatsCard } from '@/components/ui/StatsCard'
import { Button } from '@/components/ui/Button'
import { mockComplianceDocs } from '@/lib/mockData'
import { formatDate } from '@/lib/utils'
import { Shield, AlertTriangle, CheckCircle, Clock, Search, Plus } from 'lucide-react'
import type { ComplianceDoc } from '@/types'

const statusConfig: Record<ComplianceDoc['status'], { variant: 'green' | 'red' | 'amber' | 'gray'; label: string }> = {
  active: { variant: 'green', label: 'Active' },
  expired: { variant: 'red', label: 'Expired' },
  pending: { variant: 'amber', label: 'Pending' },
  expiring_soon: { variant: 'orange' as 'amber', label: 'Expiring Soon' },
}

export default function CompliancePage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = mockComplianceDocs.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || d.status === statusFilter
    return matchSearch && matchStatus
  })

  const active = mockComplianceDocs.filter(d => d.status === 'active').length
  const expired = mockComplianceDocs.filter(d => d.status === 'expired').length
  const expiringSoon = mockComplianceDocs.filter(d => d.status === 'expiring_soon').length
  const pending = mockComplianceDocs.filter(d => d.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance</h1>
          <p className="text-gray-500 text-sm mt-1">Track licenses, permits and regulatory documents</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Add Document</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard variant="hero" label="Total Documents" value={mockComplianceDocs.length} icon={<Shield className="w-5 h-5 text-white" />} />
        <StatsCard label="Active" value={active} icon={<CheckCircle className="w-5 h-5" />} variant="default" />
        <StatsCard label="Expiring Soon" value={expiringSoon} icon={<Clock className="w-5 h-5" />} variant="amber" />
        <StatsCard label="Expired" value={expired} icon={<AlertTriangle className="w-5 h-5" />} variant="blue" />
      </div>

      {(expired > 0 || expiringSoon > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Action Required</p>
            <p className="text-sm text-amber-700 mt-0.5">
              {expired > 0 && `${expired} document${expired > 1 ? 's' : ''} expired. `}
              {expiringSoon > 0 && `${expiringSoon} document${expiringSoon > 1 ? 's' : ''} expiring soon.`}
              {' '}Please renew immediately.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Document</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Type</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Uploaded By</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Uploaded</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Expiry</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(doc => {
                  const cfg = statusConfig[doc.status]
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{doc.title}</td>
                      <td className="px-6 py-4 text-gray-500">{doc.type}</td>
                      <td className="px-6 py-4 text-gray-600">{doc.uploadedBy}</td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(doc.uploadedAt)}</td>
                      <td className={`px-6 py-4 font-medium ${doc.status === 'expired' ? 'text-red-600' : doc.status === 'expiring_soon' ? 'text-amber-600' : 'text-gray-700'}`}>
                        {formatDate(doc.expiryDate)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">No documents found</div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
