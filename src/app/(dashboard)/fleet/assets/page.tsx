'use client'
import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatsCard } from '@/components/ui/StatsCard'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Package, Search, Plus, TrendingDown } from 'lucide-react'

interface Asset {
  id: string
  assetNo: string
  name: string
  category: 'vehicle' | 'it' | 'furniture' | 'equipment' | 'other'
  status: 'active' | 'maintenance' | 'disposed' | 'retired'
  purchaseDate: string
  purchasePrice: number
  currentValue: number
  depreciationRate: number
  assignedTo: string
  department: string
  serialNumber: string
}

const assets: Asset[] = [
  { id: 'AST-001', assetNo: 'AST-001', name: 'Honda CB300R', category: 'vehicle', status: 'active', purchaseDate: '2022-01-15', purchasePrice: 2800, currentValue: 2100, depreciationRate: 15, assignedTo: 'Hassan Al-Bakri', department: 'Operations', serialNumber: 'HND-2022-001' },
  { id: 'AST-002', assetNo: 'AST-002', name: 'Toyota Hiace Van', category: 'vehicle', status: 'active', purchaseDate: '2021-06-10', purchasePrice: 18000, currentValue: 12000, depreciationRate: 20, assignedTo: 'Khalid Al-Dosari', department: 'Operations', serialNumber: 'TOY-2021-001' },
  { id: 'AST-003', assetNo: 'AST-003', name: 'Dell Latitude 5520', category: 'it', status: 'active', purchaseDate: '2023-03-01', purchasePrice: 900, currentValue: 720, depreciationRate: 25, assignedTo: 'Ahmed Al-Rashid', department: 'Finance', serialNumber: 'DELL-2023-001' },
  { id: 'AST-004', assetNo: 'AST-004', name: 'Suzuki GSX 150', category: 'vehicle', status: 'maintenance', purchaseDate: '2022-09-20', purchasePrice: 2200, currentValue: 1500, depreciationRate: 20, assignedTo: 'Unassigned', department: 'Operations', serialNumber: 'SUZ-2022-001' },
  { id: 'AST-005', assetNo: 'AST-005', name: 'HP LaserJet 408dn', category: 'it', status: 'active', purchaseDate: '2022-11-05', purchasePrice: 350, currentValue: 210, depreciationRate: 30, assignedTo: 'Office', department: 'HR', serialNumber: 'HP-2022-001' },
  { id: 'AST-006', assetNo: 'AST-006', name: 'Office Workstation Set', category: 'furniture', status: 'active', purchaseDate: '2021-01-10', purchasePrice: 1200, currentValue: 720, depreciationRate: 15, assignedTo: 'HR Dept', department: 'HR', serialNumber: 'FRN-2021-001' },
  { id: 'AST-007', assetNo: 'AST-007', name: 'Yamaha Nmax 155', category: 'vehicle', status: 'active', purchaseDate: '2023-05-15', purchasePrice: 3100, currentValue: 2635, depreciationRate: 15, assignedTo: 'Turki Al-Ghamdi', department: 'Operations', serialNumber: 'YAM-2023-001' },
  { id: 'AST-008', assetNo: 'AST-008', name: 'Server Rack (2U)', category: 'it', status: 'active', purchaseDate: '2021-07-20', purchasePrice: 4500, currentValue: 2700, depreciationRate: 20, assignedTo: 'IT Room', department: 'IT', serialNumber: 'SRV-2021-001' },
  { id: 'AST-009', assetNo: 'AST-009', name: 'Refrigerated Van', category: 'vehicle', status: 'retired', purchaseDate: '2018-03-10', purchasePrice: 22000, currentValue: 4400, depreciationRate: 20, assignedTo: 'Disposed', department: 'Operations', serialNumber: 'REF-2018-001' },
  { id: 'AST-010', assetNo: 'AST-010', name: 'CCTV System (8 cam)', category: 'equipment', status: 'active', purchaseDate: '2022-06-01', purchasePrice: 1800, currentValue: 1260, depreciationRate: 20, assignedTo: 'Office', department: 'Admin', serialNumber: 'CCTV-2022-001' },
]

const catColors: Record<Asset['category'], 'green' | 'blue' | 'purple' | 'amber' | 'gray'> = {
  vehicle: 'green',
  it: 'blue',
  furniture: 'amber',
  equipment: 'purple',
  other: 'gray',
}

const statusColors: Record<Asset['status'], 'green' | 'amber' | 'gray' | 'red'> = {
  active: 'green',
  maintenance: 'amber',
  disposed: 'red',
  retired: 'gray',
}

export default function AssetsPage() {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<'all' | Asset['category']>('all')

  const filtered = assets.filter(a => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.assetNo.toLowerCase().includes(search.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'all' || a.category === catFilter
    return matchSearch && matchCat
  })

  const totalValue = assets.reduce((s, a) => s + a.currentValue, 0)
  const totalPurchase = assets.reduce((s, a) => s + a.purchasePrice, 0)
  const activeCount = assets.filter(a => a.status === 'active').length
  const maintenanceCount = assets.filter(a => a.status === 'maintenance').length

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Master</h1>
          <p className="text-gray-400 text-sm mt-0.5">Unified asset register and depreciation tracking</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Add Asset</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          variant="hero"
          label="Total Assets"
          value={assets.length}
          icon={<Package className="w-5 h-5 text-white" />}
        />
        <StatsCard
          label="Active"
          value={activeCount}
          icon={<Package className="w-5 h-5" />}
          variant="teal"
        />
        <StatsCard
          label="In Maintenance"
          value={maintenanceCount}
          icon={<Package className="w-5 h-5" />}
          variant="amber"
        />
        <StatsCard
          label="Total Book Value"
          value={formatCurrency(totalValue)}
          icon={<TrendingDown className="w-5 h-5" />}
          variant="teal"
          subValue={`Purchased: ${formatCurrency(totalPurchase)}`}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, asset no, serial…"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <select
              value={catFilter}
              onChange={e => setCatFilter(e.target.value as typeof catFilter)}
              className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white"
            >
              <option value="all">All Categories</option>
              <option value="vehicle">Vehicle</option>
              <option value="it">IT</option>
              <option value="furniture">Furniture</option>
              <option value="equipment">Equipment</option>
              <option value="other">Other</option>
            </select>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Asset No', 'Name', 'Category', 'Purchase Date', 'Purchase Price', 'Book Value', 'Depreciation', 'Assigned To', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-medium text-gray-400 text-xs uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">
                      No assets found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500 whitespace-nowrap">{a.assetNo}</td>
                      <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">{a.name}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={catColors[a.category]}>{a.category.toUpperCase()}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{formatDate(a.purchaseDate)}</td>
                      <td className="px-5 py-3.5 text-gray-700 whitespace-nowrap">{formatCurrency(a.purchasePrice)}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(a.currentValue)}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="text-red-500 font-medium">{a.depreciationRate}% / yr</span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{a.assignedTo}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={statusColors[a.status]}>{a.status.charAt(0).toUpperCase() + a.status.slice(1)}</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
            <span>Showing {filtered.length} of {assets.length} assets</span>
            <span>
              Total book value of filtered:{' '}
              <span className="font-semibold text-gray-700">
                {formatCurrency(filtered.reduce((s, a) => s + a.currentValue, 0))}
              </span>
            </span>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
