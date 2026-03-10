'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatsCard } from '@/components/ui/StatsCard'
import { mockEmployees, mockDrivers, mockTickets, mockCODEntries } from '@/lib/mockData'
import { formatDate, getInitials } from '@/lib/utils'
import { Shield, Users, Truck, AlertCircle, Settings, Activity } from 'lucide-react'

const roles = [
  { role: 'super-admin', label: 'Super Admin', email: 'admin@courierx.sa', access: 'Full System Access', color: 'red' as const },
  { role: 'ceo', label: 'CEO', email: 'ceo@courierx.sa', access: 'Executive Overview', color: 'purple' as const },
  { role: 'gm', label: 'General Manager', email: 'gm@courierx.sa', access: 'Operations Management', color: 'blue' as const },
  { role: 'finance', label: 'Finance Controller', email: 'finance@courierx.sa', access: 'Financial Management', color: 'green' as const },
  { role: 'hr', label: 'HR Lead', email: 'hr@courierx.sa', access: 'Human Resources', color: 'amber' as const },
  { role: 'legal', label: 'Legal Officer', email: 'legal@courierx.sa', access: 'Legal & Compliance', color: 'gray' as const },
]

const systemModules = [
  { name: 'Authentication', status: 'operational', icon: Shield },
  { name: 'Finance Module', status: 'operational', icon: Activity },
  { name: 'HR Module', status: 'operational', icon: Users },
  { name: 'Operations Module', status: 'operational', icon: Truck },
  { name: 'Legal Module', status: 'operational', icon: Shield },
  { name: 'Notifications', status: 'operational', icon: AlertCircle },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'system'>('overview')

  const openTickets = mockTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length
  const pendingCOD = mockCODEntries.filter(c => c.status === 'pending').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-1">System management and configuration</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard variant="hero" label="Total Users" value={mockEmployees.length} icon={<Users className="w-5 h-5 text-white" />} />
        <StatsCard label="Active Drivers" value={mockDrivers.filter(d => d.status === 'active').length} icon={<Truck className="w-5 h-5" />} variant="default" />
        <StatsCard label="Open Tickets" value={openTickets} icon={<AlertCircle className="w-5 h-5" />} variant="amber" />
        <StatsCard label="Pending COD" value={pendingCOD} icon={<Activity className="w-5 h-5" />} variant="blue" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['overview', 'users', 'system'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><h2 className="font-semibold text-gray-900">Recent Activity</h2></CardHeader>
            <CardBody className="space-y-3">
              {mockTickets.slice(0, 6).map(t => (
                <div key={t.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold flex-shrink-0">
                    {getInitials(t.reporter)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{t.title}</p>
                    <p className="text-xs text-gray-400">{t.reporter} · {formatDate(t.createdAt)}</p>
                  </div>
                  <Badge variant={t.priority === 'critical' ? 'red' : t.priority === 'high' ? 'amber' : 'gray'}>
                    {t.priority}
                  </Badge>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="font-semibold text-gray-900">System Modules</h2></CardHeader>
            <CardBody className="space-y-2">
              {systemModules.map(m => (
                <div key={m.name} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <m.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{m.name}</span>
                  </div>
                  <Badge variant="green">Operational</Badge>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">Role Management</h2></CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Role</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Access Level</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {roles.map(r => (
                    <tr key={r.role} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                            {r.label.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{r.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{r.email}</td>
                      <td className="px-6 py-4 text-gray-600">{r.access}</td>
                      <td className="px-6 py-4"><Badge variant="green">Active</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-500" />
                <h2 className="font-semibold text-gray-900">System Configuration</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {[
                { label: 'App Version', value: 'v1.0.0' },
                { label: 'Environment', value: 'Production' },
                { label: 'Database', value: 'Supabase (PostgreSQL)' },
                { label: 'Auth Provider', value: 'Supabase Auth' },
                { label: 'Deployment', value: 'Vercel' },
                { label: 'Framework', value: 'Next.js 16' },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="font-semibold text-gray-900">Data Summary</h2></CardHeader>
            <CardBody className="space-y-4">
              {[
                { label: 'Employees', value: mockEmployees.length },
                { label: 'Drivers', value: mockDrivers.length },
                { label: 'COD Entries', value: mockCODEntries.length },
                { label: 'Support Tickets', value: mockTickets.length },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  )
}
