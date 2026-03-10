'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { DataTable, Column } from '@/components/ui/Table'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal, ConfirmModal } from '@/components/ui/Modal'
import { StatsCard } from '@/components/ui/StatsCard'
import { mockCODEntries } from '@/lib/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react'
import type { CODEntry } from '@/types'
import toast from 'react-hot-toast'

export default function CODQueuePage() {
  const [entries, setEntries] = useState(mockCODEntries)
  const [approveTarget, setApproveTarget] = useState<CODEntry | null>(null)
  const [rejectTarget, setRejectTarget] = useState<CODEntry | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [processing, setProcessing] = useState(false)

  const pending = entries.filter(e => e.status === 'pending')
  const approved = entries.filter(e => e.status === 'approved')
  const rejected = entries.filter(e => e.status === 'rejected')

  const handleApprove = async () => {
    if (!approveTarget) return
    setProcessing(true)
    await new Promise(r => setTimeout(r, 800))
    setEntries(prev => prev.map(e => e.id === approveTarget.id ? { ...e, status: 'approved' } : e))
    toast.success(`COD entry for ${approveTarget.driverName} approved`)
    setApproveTarget(null)
    setProcessing(false)
  }

  const handleReject = async () => {
    if (!rejectTarget) return
    setProcessing(true)
    await new Promise(r => setTimeout(r, 800))
    setEntries(prev => prev.map(e => e.id === rejectTarget.id ? { ...e, status: 'rejected', notes: rejectReason } : e))
    toast.error(`COD entry for ${rejectTarget.driverName} rejected`)
    setRejectTarget(null)
    setRejectReason('')
    setProcessing(false)
  }

  const columns: Column<CODEntry>[] = [
    {
      key: 'driver',
      header: 'Driver',
      accessor: (r) => <span className="font-medium text-gray-800">{r.driverName}</span>,
      sortable: true,
      sortValue: (r) => r.driverName,
    },
    {
      key: 'amount',
      header: 'Amount',
      accessor: (r) => <span className="font-bold text-gray-900">{formatCurrency(r.amount)}</span>,
      sortable: true,
      sortValue: (r) => r.amount,
    },
    { key: 'platform', header: 'Platform', accessor: (r) => r.platform, sortable: true, sortValue: (r) => r.platform },
    { key: 'date', header: 'Date', accessor: (r) => formatDate(r.date), sortable: true, sortValue: (r) => r.date },
    { key: 'batch', header: 'Batch ID', accessor: (r) => <span className="text-xs font-mono text-gray-500">{r.batchId}</span> },
    { key: 'status', header: 'Status', accessor: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (r) => r.status === 'pending' ? (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="success"
            onClick={(e) => { e.stopPropagation(); setApproveTarget(r) }}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => { e.stopPropagation(); setRejectTarget(r) }}
          >
            Reject
          </Button>
        </div>
      ) : (
        <span className="text-xs text-gray-400 italic">Processed</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">COD Queue</h1>
        <p className="text-gray-500 text-sm mt-1">Review and approve cash-on-delivery entries</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          variant="amber"
          label="Pending Approval"
          value={pending.length}
          subValue={formatCurrency(pending.reduce((s, e) => s + e.amount, 0))}
          icon={<Clock className="w-5 h-5" />}
        />
        <StatsCard
          label="Approved"
          value={approved.length}
          subValue={formatCurrency(approved.reduce((s, e) => s + e.amount, 0))}
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <StatsCard
          label="Rejected"
          value={rejected.length}
          subValue={formatCurrency(rejected.reduce((s, e) => s + e.amount, 0))}
          variant="amber"
          icon={<XCircle className="w-5 h-5" />}
        />
      </div>

      {/* Pending section */}
      {pending.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader className="bg-amber-50 border-amber-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-amber-900">Pending Approval ({pending.length})</h3>
            </div>
          </CardHeader>
          <CardBody className="pt-0 px-0">
            <DataTable
              data={pending as unknown as Record<string, unknown>[]}
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              searchable
              searchPlaceholder="Search pending entries..."
              searchKeys={['driverName', 'platform'] as never[]}
              pageSize={10}
            />
          </CardBody>
        </Card>
      )}

      {/* All entries */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">All COD Entries</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 px-0">
          <DataTable
            data={entries as unknown as Record<string, unknown>[]}
            columns={columns as unknown as Column<Record<string, unknown>>[]}
            searchable
            searchPlaceholder="Search all entries..."
            searchKeys={['driverName', 'platform', 'batchId'] as never[]}
            exportable
            exportFileName="cod-entries"
            pageSize={10}
          />
        </CardBody>
      </Card>

      {/* Approve modal */}
      <ConfirmModal
        open={!!approveTarget}
        onClose={() => setApproveTarget(null)}
        onConfirm={handleApprove}
        title="Approve COD Entry"
        description={`Approve COD entry of ${approveTarget ? formatCurrency(approveTarget.amount) : ''} from ${approveTarget?.driverName} (${approveTarget?.platform})?`}
        confirmLabel="Approve"
        variant="primary"
        loading={processing}
      />

      {/* Reject modal */}
      <Modal
        open={!!rejectTarget}
        onClose={() => { setRejectTarget(null); setRejectReason('') }}
        title="Reject COD Entry"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Rejecting {formatCurrency(rejectTarget?.amount || 0)} from <strong>{rejectTarget?.driverName}</strong> ({rejectTarget?.platform})
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for rejection</label>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => { setRejectTarget(null); setRejectReason('') }}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject} loading={processing} disabled={!rejectReason.trim()}>
              Reject Entry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
