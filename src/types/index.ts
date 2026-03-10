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
  nationality?: string
  visaExpiry?: string
  contractType?: 'local' | 'offshore' | 'contract'
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
  nationality?: string
  licenseExpiry?: string
  platformAccountId?: string
  platformStatus?: 'verified' | 'pending' | 'rejected'
  codBalance?: number
  weeklyEarnings?: number
  monthlyEarnings?: number
}

export interface PlatformAccount {
  id: string
  platform: 'Keeta' | 'Jahez' | 'Ninja' | 'Noon'
  accountId: string
  status: 'active' | 'suspended' | 'pending'
  totalDrivers: number
  activeDrivers: number
  monthlyRevenue: number
  commissionRate: number
  lastSync: string
  contactPerson: string
  contractExpiry: string
}

export interface CODEntry {
  id: string
  driverId: string
  driverName: string
  amount: number
  platformFee?: number
  tax?: number
  netAmount?: number
  platform: string
  status: 'pending' | 'approved' | 'rejected' | 'disbursed'
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
  depositType?: 'cod_collection' | 'bank_transfer' | 'wps'
  notes?: string
}

export interface Invoice {
  id: string
  invoiceNo: string
  client: string
  platform?: string
  amount: number
  tax: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  dueDate: string
  issueDate: string
}

export interface AccountingEntry {
  id: string
  date: string
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  department?: string
  costCenter?: string
  reference?: string
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
  hiringType?: 'local' | 'offshore' | 'rider'
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
  appliedDate: string
  nationality?: string
  notes?: string
  visaRequired?: boolean
}

export interface Contract {
  id: string
  employeeId: string
  employeeName: string
  type: 'local' | 'offshore' | 'rider' | 'contract'
  status: 'active' | 'expired' | 'pending_renewal' | 'terminated'
  startDate: string
  endDate: string
  salary: number
  visaStatus?: 'valid' | 'expiring_soon' | 'expired' | 'not_required'
  visaExpiry?: string
  nationality: string
  department: string
}

export interface OnboardingApplication {
  id: string
  applicantName: string
  phone: string
  email: string
  nationality: string
  platform: 'Keeta' | 'Jahez' | 'Ninja' | 'Noon'
  vehicleType: 'motorcycle' | 'car' | 'van'
  status: 'submitted' | 'documents_review' | 'background_check' | 'platform_registration' | 'training' | 'active' | 'rejected'
  appliedDate: string
  notes?: string
}

export type OnboardingStage =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hr_processing'
  | 'visa_processing'
  | 'contract_signing'
  | 'onboarded'
  | 'rejected'

export type HiringType = 'local' | 'offshore' | 'rider'

export interface HROnboardingApplication {
  id: string
  applicantName: string
  email: string
  phone: string
  nationality: string
  position: string
  department: string
  type: HiringType
  stage: OnboardingStage
  appliedDate: string
  notes?: string
  visaRequired: boolean
  source: string
}

export interface EmployeeContract {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  contractType: 'full_time' | 'part_time' | 'contract' | 'probation'
  startDate: string
  endDate: string
  salary: number
  status: 'active' | 'expiring' | 'expired' | 'terminated'
  nationality: string
  daysUntilExpiry?: number
}

export interface VisaRecord {
  id: string
  employeeId: string
  employeeName: string
  nationality: string
  visaType: string
  issueDate: string
  expiryDate: string
  cprNumber: string
  passportNumber: string
  passportExpiry: string
  status: 'valid' | 'expiring' | 'expired'
  sponsor: string
}

export interface WorkPermit {
  id: string
  employeeId: string
  employeeName: string
  nationality: string
  permitNumber: string
  issueDate: string
  expiryDate: string
  category: string
  status: 'valid' | 'expiring' | 'expired'
}

export interface KPI {
  id: string
  department: string
  metric: string
  target: number
  actual: number
  unit: string
  period: string
  trend: 'up' | 'down' | 'stable'
}

export interface TalentRecord {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  performanceScore: number
  potential: 'high' | 'medium' | 'low'
  promotionReady: boolean
  trainingNeeds: string[]
  strengths: string[]
}

export interface JobPosting {
  id: string
  title: string
  department: string
  type: 'full_time' | 'part_time' | 'contract'
  location: string
  postedDate: string
  closingDate: string
  applicants: number
  status: 'active' | 'closed' | 'draft'
  hiringType: HiringType
  salaryMin: number
  salaryMax: number
}

export interface PerformanceReview {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  period: string
  overallScore: number
  kpiScore: number
  behaviorScore: number
  goalsScore: number
  reviewer: string
  status: 'draft' | 'submitted' | 'approved'
  reviewDate: string
}

export interface Asset {
  id: string
  assetNo: string
  name: string
  category: 'vehicle' | 'equipment' | 'it' | 'furniture' | 'other'
  status: 'active' | 'maintenance' | 'disposed' | 'retired'
  purchaseDate: string
  purchasePrice: number
  currentValue: number
  depreciationRate: number
  assignedTo?: string
  department?: string
  serialNumber?: string
}

export interface Vehicle {
  id: string
  plateNumber: string
  make: string
  model: string
  year: number
  type: 'motorcycle' | 'car' | 'van' | 'truck'
  status: 'active' | 'maintenance' | 'retired'
  assignedDriverId?: string
  assignedDriverName?: string
  mileage: number
  nextServiceDue: string
  insuranceExpiry: string
  registrationExpiry: string
  purchasePrice: number
  currentValue: number
  fuelType: 'petrol' | 'diesel' | 'electric'
}

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  vehiclePlate: string
  type: 'routine' | 'repair' | 'inspection' | 'accident'
  description: string
  cost: number
  date: string
  vendor: string
  status: 'scheduled' | 'in_progress' | 'completed'
  nextDue?: string
}

export interface InsurancePolicy {
  id: string
  policyNo: string
  assetId: string
  assetName: string
  provider: string
  type: 'comprehensive' | 'third_party' | 'fleet'
  premium: number
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'expiring_soon' | 'cancelled'
  coverageAmount: number
}

export interface WhatsAppContact {
  id: string
  name: string
  phone: string
  category: 'driver' | 'client' | 'staff' | 'supplier'
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  platform?: string
}

export interface WhatsAppMessage {
  id: string
  contactId: string
  direction: 'inbound' | 'outbound'
  message: string
  timestamp: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  templateId?: string
}

export interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  department: string
  baseSalary: number
  overtime: number
  allowances?: number
  deductions: number
  netSalary: number
  month: string
  status: 'pending' | 'processed' | 'paid'
  paymentMethod?: 'wps' | 'bank_transfer' | 'cash'
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
  hoursWorked?: number
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
  commissionRate?: number
}
