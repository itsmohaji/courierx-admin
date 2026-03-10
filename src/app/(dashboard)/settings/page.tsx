'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { getInitials } from '@/lib/utils'
import { User, Bell, Shield, Palette, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, role } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'appearance'>('profile')
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    codAlerts: true,
    hrUpdates: false,
    weeklyReport: true,
  })

  const save = () => toast.success('Settings saved successfully')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ] as const

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <Card>
            <CardBody className="p-2">
              <div className="flex items-center gap-3 p-3 mb-2 border-b border-gray-100 pb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                  {getInitials(user?.name || 'U')}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{role?.replace('-', ' ')}</p>
                </div>
              </div>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader><h2 className="font-semibold text-gray-900">Profile Information</h2></CardHeader>
              <CardBody className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl">
                    {getInitials(user?.name || 'U')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{role?.replace('-', ' ')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      type="email"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      type="tel"
                      placeholder="+966-55-0000000"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                    <input
                      value={role?.replace('-', ' ')}
                      disabled
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 capitalize"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <Button variant="primary" onClick={save} icon={<Save className="w-4 h-4" />}>Save Changes</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader><h2 className="font-semibold text-gray-900">Notification Preferences</h2></CardHeader>
              <CardBody className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                  { key: 'codAlerts', label: 'COD Alerts', desc: 'Get notified on new COD submissions' },
                  { key: 'hrUpdates', label: 'HR Updates', desc: 'Attendance and payroll alerts' },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Summary report every Monday' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className={`w-11 h-6 rounded-full transition-colors relative ${notifications[item.key as keyof typeof notifications] ? 'bg-primary-600' : 'bg-gray-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
                <div className="pt-2">
                  <Button variant="primary" onClick={save} icon={<Save className="w-4 h-4" />}>Save Preferences</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader><h2 className="font-semibold text-gray-900">Security Settings</h2></CardHeader>
              <CardBody className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="pt-2">
                  <Button variant="primary" onClick={() => toast.success('Password updated')} icon={<Shield className="w-4 h-4" />}>Update Password</Button>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Active Sessions</h3>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Current Session</p>
                      <p className="text-xs text-gray-400">Chrome · Saudi Arabia · Active now</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Current</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <CardHeader><h2 className="font-semibold text-gray-900">Appearance</h2></CardHeader>
              <CardBody className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'light', label: 'Light', preview: 'bg-white border-2 border-primary-500' },
                      { id: 'dark', label: 'Dark', preview: 'bg-gray-900' },
                      { id: 'system', label: 'System', preview: 'bg-gradient-to-r from-white to-gray-900' },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => t.id !== 'light' && toast('Dark mode coming soon')}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${t.id === 'light' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        <div className={`w-full h-10 rounded-lg mb-2 ${t.preview}`} />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Language</label>
                  <select className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                    <option>English</option>
                    <option>العربية (Arabic)</option>
                  </select>
                </div>
                <div className="pt-2">
                  <Button variant="primary" onClick={save} icon={<Save className="w-4 h-4" />}>Save Appearance</Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
