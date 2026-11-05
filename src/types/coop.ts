export type Role =
  | 'MEMBER'
  | 'FINANCE_OFFICER'
  | 'COOPERATIVE_LEADER'
  | 'ADMIN'
  | 'SUPER_ADMIN'

export const ROLES: Role[] = [
  'MEMBER',
  'FINANCE_OFFICER',
  'COOPERATIVE_LEADER',
  'ADMIN',
  'SUPER_ADMIN',
]

export const ROLE_LABELS: Record<Role, string> = {
  MEMBER: 'Member',
  FINANCE_OFFICER: 'Finance Officer',
  COOPERATIVE_LEADER: 'Cooperative Leader',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
}

export const ADMIN_ROLES: Role[] = [
  'FINANCE_OFFICER',
  'COOPERATIVE_LEADER',
  'ADMIN',
  'SUPER_ADMIN',
]

export type MemberStatus =
  | 'ACTIVE'
  | 'PENDING'
  | 'SUSPENDED'
  | 'INACTIVE'

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
  welfareStatus: 'IN_GOOD_STANDING' | 'ARREARS'
  address: string
}

export type TransactionType =
  | 'SAVINGS'
  | 'WELFARE'
  | 'FEE'
  | 'ADJUSTMENT'

export type TransactionStatus =
  | 'COMPLETED'
  | 'PENDING'
  | 'FAILED'
  | 'REVERSED'

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
  status:
    | 'PENDING'
    | 'UNDER_REVIEW'
    | 'APPROVED'
    | 'REJECTED'
    | 'DISBURSED'
  submittedOn: string
  decidedOn?: string

  supportingDocument?: {
    name: string
    type: string
    size: number
    dataUrl: string
  }
}

export interface WelfareContribution {
  id: string
  date: string
  memberName: string
  amount: number
}

export type NotificationCategory =
  | 'Financial'
  | 'Savings'
  | 'Community'
  | 'System'

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

  /**
   * Global pin:
   * When true, the meeting is pinned for everyone.
   */
  globalPinned?: boolean

  /**
   * Personal pins:
   * Contains the numeric IDs of members who personally pinned
   * this meeting.
   */
  personalPinnedBy?: number[]
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
  type:
    | 'Meeting'
    | 'Savings'
    | 'Training'
    | 'Community'
    | 'Election'
  date: string
  time: string
  location: string
  description: string

  /**
   * Global pin:
   * When true, the event is pinned for everyone.
   */
  globalPinned?: boolean

  /**
   * Personal pins:
   * Contains the numeric IDs of members who personally pinned
   * this event.
   */
  personalPinnedBy?: number[]
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