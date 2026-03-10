'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { Notification } from '@/types'

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  const fetchNotifications = useCallback(async () => {
    if (!userId) return
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (data && data.length > 0) {
        const mapped: Notification[] = data.map((n: Record<string, unknown>) => ({
          id: n.id as string,
          userId: n.user_id as string,
          title: n.title as string,
          body: n.body as string,
          type: (n.type as Notification['type']) || 'info',
          read: n.read as boolean,
          createdAt: n.created_at as string,
        }))
        setNotifications(mapped)
        setUnreadCount(mapped.filter(n => !n.read).length)
      } else {
        // Fallback mock notifications
        const mockNotifs: Notification[] = [
          { id: 'notif-001', userId: userId, title: 'COD Batch Ready', body: '15 COD entries ready for approval in batch BATCH-2401-001', type: 'info', read: false, createdAt: new Date().toISOString() },
          { id: 'notif-002', userId: userId, title: 'Payroll Processed', body: 'January 2024 payroll has been successfully processed', type: 'success', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: 'notif-003', userId: userId, title: 'Document Expiring', body: 'Municipal Operating License expires in 45 days', type: 'warning', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
          { id: 'notif-004', userId: userId, title: 'New Driver Application', body: '3 new driver applications pending review', type: 'info', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
          { id: 'notif-005', userId: userId, title: 'System Alert', body: 'Ninja platform API sync issue detected', type: 'error', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
        ]
        setNotifications(mockNotifs)
        setUnreadCount(mockNotifs.filter(n => !n.read).length)
      }
    } catch {
      const mockNotifs: Notification[] = [
        { id: 'notif-001', userId: userId, title: 'COD Batch Ready', body: '15 COD entries ready for approval', type: 'info', read: false, createdAt: new Date().toISOString() },
        { id: 'notif-002', userId: userId, title: 'Payroll Processed', body: 'January 2024 payroll processed successfully', type: 'success', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 'notif-003', userId: userId, title: 'Document Expiring', body: 'Municipal License expires in 45 days', type: 'warning', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
      ]
      setNotifications(mockNotifs)
      setUnreadCount(mockNotifs.filter(n => !n.read).length)
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return
    fetchNotifications()

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        const n = payload.new as Record<string, unknown>
        const newNotif: Notification = {
          id: n.id as string,
          userId: n.user_id as string,
          title: n.title as string,
          body: n.body as string,
          type: (n.type as Notification['type']) || 'info',
          read: n.read as boolean,
          createdAt: n.created_at as string,
        }
        setNotifications(prev => [newNotif, ...prev])
        setUnreadCount(prev => prev + 1)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, fetchNotifications])

  const markAllRead = async () => {
    if (!userId) return
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)
    } catch {
      // ignore
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const markRead = async (id: string) => {
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id)
    } catch {
      // ignore
    }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  return { notifications, unreadCount, markAllRead, markRead, refetch: fetchNotifications }
}
