'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Truck, Package, MapPin, Clock, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import type { Role } from '@/types'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

const roles: { value: Role; label: string; description: string }[] = [
  { value: 'super-admin', label: 'Super Admin', description: 'Full system access' },
  { value: 'ceo', label: 'CEO', description: 'Executive overview' },
  { value: 'gm', label: 'General Manager', description: 'Operations management' },
  { value: 'finance', label: 'Finance Controller', description: 'Financial management' },
  { value: 'hr', label: 'HR Lead', description: 'Human resources' },
  { value: 'legal', label: 'Legal Officer', description: 'Legal & compliance' },
]

export default function LoginPage() {
  const router = useRouter()
  const { user, signIn, updateRole } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role>('super-admin')
  const [roleDropOpen, setRoleDropOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    if (user) router.replace('/dashboard')
  }, [user, router])

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    try {
      // Set role before sign in so it's picked up
      if (typeof window !== 'undefined') {
        localStorage.setItem('courierx_role', selectedRole)
      }
      const { error } = await signIn(data.email, data.password)
      if (error) {
        // For demo, allow mock login with any credentials
        if (data.email && data.password.length >= 6) {
          updateRole(selectedRole)
          toast.success(`Welcome! Signed in as ${roles.find(r => r.value === selectedRole)?.label}`)
          router.push('/dashboard')
        } else {
          toast.error(error || 'Invalid credentials')
        }
      } else {
        updateRole(selectedRole)
        toast.success('Welcome back!')
        router.push('/dashboard')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (role: Role) => {
    setSelectedRole(role)
    setValue('email', `demo.${role}@courierx.sa`)
    setValue('password', 'demo123456')
  }

  const selectedRoleInfo = roles.find(r => r.value === selectedRole)

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 flex-col justify-between p-12 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CourierX</h1>
              <p className="text-primary-200 text-sm">Enterprise Platform</p>
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-6">
            Manage your entire<br />courier operations<br />in one place
          </h2>
          <p className="text-primary-100 text-lg mb-10 leading-relaxed">
            From COD management to driver tracking, payroll to compliance — CourierX gives you complete visibility and control.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              { icon: Package, title: 'Real-time COD Tracking', desc: 'Monitor cash collections across all platforms' },
              { icon: MapPin, title: 'Driver Management', desc: 'Track 30+ drivers across Keeta, Jahez, Ninja & Noon' },
              { icon: Clock, title: 'HR & Payroll Automation', desc: 'Streamline attendance, leaves and salary processing' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-primary-200 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: '30+', label: 'Active Drivers' },
            { value: '4', label: 'Platforms' },
            { value: 'SAR 1.2M', label: 'Monthly Volume' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-primary-200 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#f4f6f9]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CourierX</h1>
              <p className="text-gray-500 text-xs">Enterprise Platform</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-500 mt-1.5">Sign in to your CourierX account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  placeholder="you@courierx.sa"
                  {...register('email')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>

              {/* Role selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Sign in as
                  <span className="ml-1 text-xs text-gray-400 font-normal">(demo mode)</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRoleDropOpen(v => !v)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-gray-400 transition-colors bg-white"
                  >
                    <div>
                      <span className="font-medium text-gray-800">{selectedRoleInfo?.label}</span>
                      <span className="ml-2 text-gray-400 text-xs">{selectedRoleInfo?.description}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${roleDropOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {roleDropOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                      {roles.map(r => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => { setSelectedRole(r.value); setRoleDropOpen(false) }}
                          className={`w-full px-4 py-3 text-sm text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${selectedRole === r.value ? 'bg-primary-50' : ''}`}
                        >
                          <div>
                            <span className={`font-medium ${selectedRole === r.value ? 'text-primary-700' : 'text-gray-700'}`}>{r.label}</span>
                            <span className="ml-2 text-gray-400 text-xs">{r.description}</span>
                          </div>
                          {selectedRole === r.value && (
                            <div className="w-2 h-2 rounded-full bg-primary-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo quick access */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center mb-3">Quick demo access</p>
              <div className="grid grid-cols-3 gap-2">
                {roles.slice(0, 6).map(role => (
                  <button
                    key={role.value}
                    onClick={() => handleDemoLogin(role.value)}
                    className="py-2 px-2 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-center"
                  >
                    {role.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center mt-3">
                Use any email + password (min 6 chars) with demo roles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
