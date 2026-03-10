'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatsCard } from '@/components/ui/StatsCard'
import { mockDrivers } from '@/lib/mockData'
import { Star, Truck, TrendingUp, Award } from 'lucide-react'
import type { Driver } from '@/types'

const platformColors: Record<Driver['platform'], 'green' | 'amber' | 'blue' | 'purple'> = {
  Keeta: 'green',
  Jahez: 'amber',
  Ninja: 'blue',
  Noon: 'purple',
}

function RatingBar({ value, max = 5 }: { value: number; max?: number }) {
  const pct = (value / max) * 100
  const color = pct >= 90 ? 'bg-emerald-500' : pct >= 75 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-600 w-8 text-right">{value}</span>
    </div>
  )
}

export default function PerformancePage() {
  const [platformFilter, setPlatformFilter] = useState('all')

  const filtered = mockDrivers.filter(d =>
    (platformFilter === 'all' || d.platform === platformFilter) && d.status === 'active'
  )

  const sorted = [...filtered].sort((a, b) => b.deliveries - a.deliveries)
  const topDriver = sorted[0]
  const totalDeliveries = mockDrivers.reduce((s, d) => s + d.deliveries, 0)
  const avgRating = (mockDrivers.reduce((s, d) => s + d.rating, 0) / mockDrivers.length).toFixed(1)
  const topRated = mockDrivers.filter(d => d.rating >= 4.8).length

  const platformStats = (['Keeta', 'Jahez', 'Ninja', 'Noon'] as Driver['platform'][]).map(p => {
    const drivers = mockDrivers.filter(d => d.platform === p)
    return {
      platform: p,
      count: drivers.length,
      deliveries: drivers.reduce((s, d) => s + d.deliveries, 0),
      avgRating: drivers.length ? (drivers.reduce((s, d) => s + d.rating, 0) / drivers.length).toFixed(1) : '0',
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance</h1>
        <p className="text-gray-500 text-sm mt-1">Driver performance metrics across all platforms</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard variant="hero" label="Total Deliveries" value={totalDeliveries.toLocaleString()} icon={<Truck className="w-5 h-5 text-white" />} />
        <StatsCard label="Avg Rating" value={avgRating} change={2.1} changeLabel="vs last month" icon={<Star className="w-5 h-5" />} variant="default" />
        <StatsCard label="Top Rated (≥4.8)" value={topRated} icon={<Award className="w-5 h-5" />} variant="blue" />
        <StatsCard label="Top Driver" value={topDriver?.name.split(' ')[0] || '—'} subValue={`${topDriver?.deliveries.toLocaleString()} deliveries`} icon={<TrendingUp className="w-5 h-5" />} variant="amber" />
      </div>

      {/* Platform summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map(ps => (
          <Card key={ps.platform}>
            <CardBody>
              <div className="flex items-center justify-between mb-3">
                <Badge variant={platformColors[ps.platform as Driver['platform']]}>{ps.platform}</Badge>
                <span className="text-xs text-gray-400">{ps.count} drivers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{ps.deliveries.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-0.5">deliveries</p>
              <div className="mt-3">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{ps.avgRating} avg rating</span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Driver leaderboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Driver Leaderboard</h2>
            <select
              value={platformFilter}
              onChange={e => setPlatformFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="all">All Platforms</option>
              <option value="Keeta">Keeta</option>
              <option value="Jahez">Jahez</option>
              <option value="Ninja">Ninja</option>
              <option value="Noon">Noon</option>
            </select>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Rank</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Driver</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Platform</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Deliveries</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500 w-40">Rating</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Area</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.map((d, i) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {i < 3 ? (
                        <span className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-600'}`}>
                          {i + 1}
                        </span>
                      ) : (
                        <span className="text-gray-400 pl-2">{i + 1}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{d.name}</td>
                    <td className="px-6 py-4">
                      <Badge variant={platformColors[d.platform]}>{d.platform}</Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{d.deliveries.toLocaleString()}</td>
                    <td className="px-6 py-4 w-40">
                      <RatingBar value={d.rating} />
                    </td>
                    <td className="px-6 py-4 text-gray-500">{d.area}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
