export type Role = 'super-admin' | 'ceo' | 'gm' | 'finance' | 'hr' | 'legal'

export interface User {
  id: string
  email: string
  name: string
  role: Role
  avatar?: string
  department?: string
  phone?: string
}

export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  status: 'active' | 'inactive' | 'on_leave'
  salary: number
  joinDate: string
  avatar?: string
  nationalId?: string
  address?: string
}

export interface Driver {
  id: string
  name: string
  phone: string
  platform: 'Keeta' | 'Jahez' | 'Ninja' | 'Noon'
  status: 'active' | 'inactive' | 'suspended'
  deliveries: number
  rating: number
  vehicle: string
  area: string
  joinDate: string
  nationalId?: string
  licenseExpiry?: string
  avatar?: string
}

export interface CODEntry {
  id: string
  driverId: string
  driverName: string
  amount: number
  platform: string
  status: 'pending' | 'approved' | 'rejected'
  date: string
  batchId: string
  notes?: string
}

export interface Deposit {
  id: string
  amount: number
  bank: string
  date: string
  status: 'pending' | 'confirmed' | 'failed'
  reference: string
  notes?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  body: string
  type: 'info' | 'warning' | 'success' | 'error'
  read: boolean
  createdAt: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: string
  reporter: string
  createdAt: string
  updatedAt: string
}

export interface ComplianceDoc {
  id: string
  title: string
  type: string
  status: 'active' | 'expired' | 'pending' | 'expiring_soon'
  expiryDate: string
  uploadedAt: string
  fileUrl?: string
  uploadedBy: string
}

export interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
  appliedDate: string
  notes?: string
  resumeUrl?: string
}

export interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  department: string
  baseSalary: number
  overtime: number
  deductions: number
  netSalary: number
  month: string
  status: 'pending' | 'processed' | 'paid'
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn: string
  checkOut: string
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'
  department: string
}

export interface MonthlyRevenue {
  month: string
  revenue: number
  expenses: number
  profit: number
}

export interface PlatformBreakdown {
  platform: string
  amount: number
  deliveries: number
  color: string
}
