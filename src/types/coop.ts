/** Domain types for the cooperative platform. Backed by mock data (src/data/) until a real API exists. */

export type Role =
  | 'MEMBER'
  | 'LOAN_OFFICER'
  | 'FINANCE_OFFICER'
  | 'COOPERATIVE_LEADER'
  | 'ADMIN'
  | 'SUPER_ADMIN'

export const ROLES: Role[] = [
  'MEMBER',
  'LOAN_OFFICER',
  'FINANCE_OFFICER',
  'COOPERATIVE_LEADER',
  'ADMIN',
  'SUPER_ADMIN',
]

export const ROLE_LABELS: Record<Role, string> = {
  MEMBER: 'Member',
  LOAN_OFFICER: 'Loan Officer',
  FINANCE_OFFICER: 'Finance Officer',
  COOPERATIVE_LEADER: 'Cooperative Leader',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
}

export const ADMIN_ROLES: Role[] = [
  'LOAN_OFFICER',
  'FINANCE_OFFICER',
  'COOPERATIVE_LEADER',
  'ADMIN',
  'SUPER_ADMIN',
]

export type MemberStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE'

export interface Member {
  id: string
  memberNumber: string
  name: string
  email: string
  phone: string
  avatarColor: string
  status: MemberStatus
  role: Role
  joinedOn: string
  branch: string
  occupation: string
  totalSavings: number
  totalShares: number
  shareValue: number
  outstandingLoan: number
  welfareStatus: 'IN_GOOD_STANDING' | 'ARREARS'
  nextOfKin: string
  address: string
}

export type TransactionType =
  | 'SAVINGS'
  | 'SHARE'
  | 'LOAN_DISBURSEMENT'
  | 'LOAN_REPAYMENT'
  | 'DIVIDEND'
  | 'WELFARE'
  | 'FEE'
  | 'ADJUSTMENT'

export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'REVERSED'

export interface Transaction {
  id: string
  reference: string
  date: string
  type: TransactionType
  description: string
  amount: number
  status: TransactionStatus
  balanceAfter: number
  memberId: string
  memberName: string
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  savedAmount: number
  targetDate: string
}

export interface SavingsContribution {
  id: string
  date: string
  amount: number
  method: 'CASH' | 'MOBILE_MONEY' | 'BANK_TRANSFER'
  status: 'CONFIRMED' | 'PENDING'
  cycle: string
}

export interface SharePurchase {
  id: string
  date: string
  shares: number
  amount: number
  status: 'CONFIRMED' | 'PENDING'
}

export type LoanType =
  | 'Emergency Loan'
  | 'Business Loan'
  | 'Education Loan'
  | 'Development Loan'
  | 'Event Support Loan'

export type LoanStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'DISBURSED'
  | 'ACTIVE'
  | 'OVERDUE'
  | 'COMPLETED'

export interface LoanInstallment {
  id: string
  dueDate: string
  amount: number
  principal: number
  interest: number
  status: 'PAID' | 'DUE' | 'UPCOMING' | 'OVERDUE'
  paidOn?: string
}

export interface Loan {
  id: string
  reference: string
  memberId: string
  memberName: string
  type: LoanType
  purpose: string
  principal: number
  interestRate: number
  termMonths: number
  outstandingBalance: number
  monthlyPayment: number
  status: LoanStatus
  appliedOn: string
  approvedOn?: string
  disbursedOn?: string
  nextPaymentDate?: string
  installments: LoanInstallment[]
}

export interface DividendRecord {
  id: string
  year: number
  cooperativeProfit: number
  dividendPool: number
  eligibleMembers: number
  personalDividend: number
  sharesHeld: number
  status: 'CALCULATED' | 'APPROVED' | 'PAID'
  paidOn?: string
  distributionRate: number
}

export type WelfareCategory =
  | 'Medical'
  | 'Bereavement'
  | 'Education'
  | 'Emergency'
  | 'Family Event'
  | 'Other'

export interface WelfareRequest {
  id: string
  reference: string
  memberId: string
  memberName: string
  category: WelfareCategory
  amountRequested: number
  amountApproved?: number
  reason: string
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISBURSED'
  submittedOn: string
  decidedOn?: string
}

export interface WelfareContribution {
  id: string
  date: string
  memberName: string
  amount: number
}

export type NotificationCategory =
  'Financial' | 'Loan' | 'Savings' | 'Community' | 'System'

export interface AppNotification {
  id: string
  category: NotificationCategory
  title: string
  message: string
  date: string
  read: boolean
}

export interface Leader {
  id: string
  name: string
  position: string
  committee: string
  since: string
  avatarColor: string
}

export interface Meeting {
  id: string
  title: string
  type: 'AGM' | 'Committee' | 'Emergency' | 'Regular'
  date: string
  location: string
  status: 'UPCOMING' | 'PAST'
  attendance?: number
  minutesAvailable: boolean
  agenda: string[]
}

export interface ElectionCandidate {
  id: string
  name: string
  statement: string
  votes: number
}

export interface ElectionPosition {
  id: string
  title: string
  candidates: ElectionCandidate[]
  status: 'OPEN' | 'CLOSED'
  closesOn: string
}

export interface CooperativeEvent {
  id: string
  title: string
  type: 'Meeting' | 'Savings' | 'Training' | 'Community' | 'Election'
  date: string
  time: string
  location: string
  description: string
}

export interface AuditLogEntry {
  id: string
  date: string
  user: string
  role: Role
  action: string
  module: string
  reference: string
  device: string
  status: 'SUCCESS' | 'FAILED'
}

export interface ConstitutionSection {
  id: string
  number: number
  title: string
  content: string[]
}
