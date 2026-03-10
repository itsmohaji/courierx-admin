'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatsCard } from '@/components/ui/StatsCard'
import { Button } from '@/components/ui/Button'
import { mockCandidates } from '@/lib/mockData'
import { formatDate } from '@/lib/utils'
import { Users, UserCheck, Search, Plus } from 'lucide-react'
import type { Candidate } from '@/types'

const stageColors: Record<Candidate['stage'], 'gray' | 'blue' | 'amber' | 'purple' | 'green' | 'red'> = {
  applied: 'gray',
  screening: 'blue',
  interview: 'amber',
  offer: 'purple',
  hired: 'green',
  rejected: 'red',
}

const stageLabels: Record<Candidate['stage'], string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
}

const stages: Candidate['stage'][] = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected']

export default function RecruitmentPage() {
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<'all' | Candidate['stage']>('all')

  const filtered = mockCandidates.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.position.toLowerCase().includes(search.toLowerCase())
    const matchStage = stageFilter === 'all' || c.stage === stageFilter
    return matchSearch && matchStage
  })

  const active = mockCandidates.filter(c => !['hired', 'rejected'].includes(c.stage)).length
  const hired = mockCandidates.filter(c => c.stage === 'hired').length
  const interviews = mockCandidates.filter(c => c.stage === 'interview').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment</h1>
          <p className="text-gray-500 text-sm mt-1">Track candidates through the hiring pipeline</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Add Candidate</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard variant="hero" label="Total Candidates" value={mockCandidates.length} icon={<Users className="w-5 h-5 text-white" />} />
        <StatsCard label="In Pipeline" value={active} icon={<Users className="w-5 h-5" />} variant="blue" />
        <StatsCard label="Hired" value={hired} icon={<UserCheck className="w-5 h-5" />} variant="default" />
      </div>

      {/* Pipeline columns */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map(stage => {
          const count = mockCandidates.filter(c => c.stage === stage).length
          return (
            <div
              key={stage}
              onClick={() => setStageFilter(stageFilter === stage ? 'all' : stage)}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${stageFilter === stage ? 'border-primary-500 bg-primary-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
            >
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <Badge variant={stageColors[stage]}>{stageLabels[stage]}</Badge>
            </div>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search candidates..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Candidate</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Position</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Department</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Applied</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{c.position}</td>
                    <td className="px-6 py-4 text-gray-500">{c.department}</td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(c.appliedDate)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={stageColors[c.stage]}>{stageLabels[c.stage]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">No candidates found</div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
