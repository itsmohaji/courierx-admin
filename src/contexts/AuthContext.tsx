'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import type { Role, User } from '@/types'

interface AuthContextType {
  user: User | null
  session: Session | null
  role: Role | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateRole: (role: Role) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function buildUser(supabaseUser: SupabaseUser, overrideRole?: Role): User {
  const meta = supabaseUser.user_metadata || {}
  const storedRole = typeof window !== 'undefined'
    ? (localStorage.getItem('courierx_role') as Role | null)
    : null
  const role: Role = overrideRole || meta.role || storedRole || 'super-admin'
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: meta.name || meta.full_name || supabaseUser.email?.split('@')[0] || 'User',
    role,
    avatar: meta.avatar_url,
    department: meta.department,
    phone: meta.phone,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = buildUser(session.user)
        setUser(u)
        setRole(u.role)
        setSession(session)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const storedRole = typeof window !== 'undefined'
          ? (localStorage.getItem('courierx_role') as Role | null)
          : null
        const u = buildUser(session.user, storedRole || undefined)
        setUser(u)
        setRole(u.role)
        setSession(session)
      } else {
        setUser(null)
        setRole(null)
        setSession(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    if (data.user) {
      const storedRole = typeof window !== 'undefined'
        ? (localStorage.getItem('courierx_role') as Role | null)
        : null
      const u = buildUser(data.user, storedRole || undefined)
      setUser(u)
      setRole(u.role)
    }
    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('courierx_role')
    }
    setUser(null)
    setRole(null)
    setSession(null)
  }

  const updateRole = (newRole: Role) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('courierx_role', newRole)
    }
    setRole(newRole)
    if (user) {
      setUser({ ...user, role: newRole })
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signIn, signOut, updateRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
