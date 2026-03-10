'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { StatusBadge, Badge } from '@/components/ui/Badge'
import { StatsCard } from '@/components/ui/StatsCard'
import { Button } from '@/components/ui/Button'
import { mockDrivers } from '@/lib/mockData'
import { formatDate, getInitials } from '@/lib/utils'
import { Truck, Star, Search, Plus } from 'lucide-react'
import type { Driver } from '@/types'

const platformColors: Record<Driver['platform'], 'green' | 'amber' | 'blue' | 'purple'> = {
  Keeta: 'green',
  Jahez: 'amber',
  Ninja: 'blue',
  Noon: 'purple',
}

export default function DriversPage() {
  const [search, setSearch] = useState('')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Driver | null>(null)

  const filtered = mockDrivers.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.area.toLowerCase().includes(search.toLowerCase())
    const matchPlatform = platformFilter === 'all' || d.platform === platformFilter
    const matchStatus = statusFilter === 'all' || d.status === statusFilter
    return matchSearch && matchPlatform && matchStatus
  })

  const active = mockDrivers.filter(d => d.status === 'active').length
  const suspended = mockDrivers.filter(d => d.status === 'suspended').length
  const avgRating = (mockDrivers.reduce((s, d) => s + d.rating, 0) / mockDrivers.length).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your driver fleet across all platforms</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Add Driver</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard variant="hero" label="Total Drivers" value={mockDrivers.length} icon={<Truck className="w-5 h-5 text-white" />} />
        <StatsCard label="Active" value={active} icon={<Truck className="w-5 h-5" />} variant="default" />
        <StatsCard label="Suspended" value={suspended} icon={<Truck className="w-5 h-5" />} variant="amber" />
        <StatsCard label="Avg Rating" value={avgRating} icon={<Star className="w-5 h-5" />} variant="blue" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search drivers..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={platformFilter}
              onChange={e => setPlatformFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="all">All Platforms</option>
              <option value="Keeta">Keeta</option>
              <option value="Jahez">Jahez</option>
              <option value="Ninja">Ninja</option>
              <option value="Noon">Noon</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Driver</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Platform</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Vehicle</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Area</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Deliveries</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Rating</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(d => (
                  <tr
                    key={d.id}
                    onClick={() => setSelected(d)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm flex-shrink-0">
                          {getInitials(d.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{d.name}</p>
                          <p className="text-xs text-gray-400">{d.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={platformColors[d.platform]}>{d.platform}</Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{d.vehicle}</td>
                    <td className="px-6 py-4 text-gray-500">{d.area}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{d.deliveries.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-medium text-gray-800">{d.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">No drivers found</div>
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
                <Badge variant={platformColors[selected.platform]}>{selected.platform}</Badge>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ['Phone', selected.phone],
                ['Vehicle', selected.vehicle],
                ['Area', selected.area],
                ['Total Deliveries', selected.deliveries.toLocaleString()],
                ['Rating', `${selected.rating} / 5.0`],
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
