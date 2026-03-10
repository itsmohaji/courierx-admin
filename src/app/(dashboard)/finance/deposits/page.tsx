'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { DataTable, Column } from '@/components/ui/Table'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input, Select } from '@/components/ui/Input'
import { StatsCard } from '@/components/ui/StatsCard'
import { mockDeposits } from '@/lib/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Building2, TrendingUp, Clock } from 'lucide-react'
import type { Deposit } from '@/types'
import toast from 'react-hot-toast'

const depositSchema = z.object({
  amount: z.string().min(1, 'Amount required').transform(Number),
  bank: z.string().min(1, 'Bank required'),
  date: z.string().min(1, 'Date required'),
  reference: z.string().min(1, 'Reference required'),
  notes: z.string().optional(),
})

type DepositForm = z.infer<typeof depositSchema>

const banks = ['Al Rajhi Bank', 'Saudi National Bank', 'Riyad Bank', 'Banque Saudi Fransi', 'Arab National Bank', 'Bank AlBilad', 'Alinma Bank']

export default function DepositsPage() {
  const [deposits, setDeposits] = useState(mockDeposits)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<DepositForm>({
    resolver: zodResolver(depositSchema),
  })

  const confirmed = deposits.filter(d => d.status === 'confirmed')
  const pending = deposits.filter(d => d.status === 'pending')

  const onSubmit = async (data: DepositForm) => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    const newDeposit: Deposit = {
      id: `dep-${Date.now()}`,
      amount: Number(data.amount),
      bank: data.bank,
      date: data.date,
      status: 'pending',
      reference: data.reference,
      notes: data.notes,
    }
    setDeposits(prev => [newDeposit, ...prev])
    toast.success('Deposit added successfully')
    reset()
    setShowModal(false)
    setSaving(false)
  }

  const columns: Column<Deposit>[] = [
    {
      key: 'bank',
      header: 'Bank',
      accessor: (r) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-800">{r.bank}</span>
        </div>
      ),
      sortable: true,
      sortValue: (r) => r.bank,
    },
    {
      key: 'amount',
      header: 'Amount',
      accessor: (r) => <span className="font-bold text-gray-900">{formatCurrency(r.amount)}</span>,
      sortable: true,
      sortValue: (r) => r.amount,
    },
    { key: 'date', header: 'Date', accessor: (r) => formatDate(r.date), sortable: true, sortValue: (r) => r.date },
    {
      key: 'reference',
      header: 'Reference',
      accessor: (r) => <span className="text-xs font-mono text-gray-600">{r.reference}</span>,
    },
    { key: 'status', header: 'Status', accessor: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'notes',
      header: 'Notes',
      accessor: (r) => <span className="text-xs text-gray-400 italic">{r.notes || '—'}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bank Deposits</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage bank deposit records</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Add Deposit
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          variant="hero"
          label="Total Confirmed"
          value={formatCurrency(confirmed.reduce((s, d) => s + d.amount, 0))}
          change={4.2}
          changeLabel="this month"
          icon={<TrendingUp className="w-5 h-5 text-white" />}
        />
        <StatsCard
          label="No. of Deposits"
          value={confirmed.length}
          subValue="confirmed"
          icon={<Building2 className="w-5 h-5" />}
        />
        <StatsCard
          label="Pending"
          value={pending.length}
          subValue={formatCurrency(pending.reduce((s, d) => s + d.amount, 0))}
          variant="amber"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-gray-900">All Deposits</h3>
        </CardHeader>
        <CardBody className="pt-0 px-0">
          <DataTable
            data={deposits as unknown as Record<string, unknown>[]}
            columns={columns as unknown as Column<Record<string, unknown>>[]}
            searchable
            searchPlaceholder="Search bank or reference..."
            searchKeys={['bank', 'reference'] as never[]}
            exportable
            exportFileName="deposits"
            pageSize={10}
          />
        </CardBody>
      </Card>

      {/* Add Deposit Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Bank Deposit" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount (SAR)"
              type="number"
              step="0.01"
              placeholder="0.00"
              registration={register('amount')}
              error={errors.amount?.message}
            />
            <Select
              label="Bank"
              registration={register('bank')}
              error={errors.bank?.message}
            >
              <option value="">Select bank...</option>
              {banks.map(b => <option key={b} value={b}>{b}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Deposit Date"
              type="date"
              registration={register('date')}
              error={errors.date?.message}
            />
            <Input
              label="Reference Number"
              placeholder="TXN-YYYYMMDD-XXX"
              registration={register('reference')}
              error={errors.reference?.message}
            />
          </div>
          <Input
            label="Notes (optional)"
            placeholder="Any additional notes..."
            registration={register('notes')}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Add Deposit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
