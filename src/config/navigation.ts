import {
  ArrowLeftRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarClock,
  CalendarDays,
  FileText,
  HeartHandshake,
  Landmark,
  LayoutDashboard,
  LayoutGrid,
  PiggyBank,
  ScrollText,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  Vote,
  Wallet,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

import { ADMIN_ROLES, type Role } from '@/types/coop'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  roles?: Role[]
}

export interface NavGroup {
  label: string
  items: NavItem[]
  roles?: Role[]
}

const OFFICER_ROLES: Role[] = [
  'FINANCE_OFFICER',
  'COOPERATIVE_LEADER',
  'ADMIN',
  'SUPER_ADMIN',
]

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        to: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },

  {
    label: 'Money',
    items: [
      {
        label: 'Savings',
        to: '/savings',
        icon: PiggyBank,
      },
      {
        label: 'Transactions',
        to: '/transactions',
        icon: ArrowLeftRight,
      },
      {
        label: 'Statements',
        to: '/statements',
        icon: FileText,
      },
    ],
  },

  {
    label: 'Community',
    items: [
      {
        label: 'Welfare & Support',
        to: '/welfare',
        icon: HeartHandshake,
      },
      {
        label: 'Events',
        to: '/events',
        icon: CalendarDays,
      },
      {
        label: 'Contributions',
        to: '/savings/contributions',
        icon: Wallet,
      },
    ],
  },

  {
    label: 'Cooperative',
    items: [
      {
        label: 'Governance',
        to: '/governance',
        icon: Landmark,
      },
      {
        label: 'Constitution',
        to: '/governance/constitution',
        icon: BookOpen,
      },
      {
        label: 'Leaders',
        to: '/governance/leaders',
        icon: Users,
      },
      {
        label: 'Meetings',
        to: '/governance/meetings',
        icon: CalendarClock,
      },
      {
        label: 'Elections',
        to: '/governance/elections',
        icon: Vote,
      },
    ],
  },

  {
    label: 'Reports',
    roles: OFFICER_ROLES,
    items: [
      {
        label: 'Financial Reports',
        to: '/admin/reports/financial',
        icon: BarChart3,
      },
      {
        label: 'Savings Reports',
        to: '/admin/reports/savings',
        icon: PiggyBank,
      },
      {
        label: 'Member Reports',
        to: '/admin/reports/members',
        icon: Users,
      },
    ],
  },

  {
    label: 'System',
    items: [
      {
        label: 'Notifications',
        to: '/notifications',
        icon: Bell,
      },
      {
        label: 'Settings',
        to: '/profile',
        icon: Settings,
      },
    ],
  },

  {
    label: 'Administration',
    roles: ADMIN_ROLES,
    items: [
      {
        label: 'Admin Dashboard',
        to: '/admin',
        icon: LayoutGrid,
      },

      {
        label: 'Leader Management',
        to: '/admin/leaders',
        icon: UserCog,
        roles: [
          'COOPERATIVE_LEADER',
          'ADMIN',
          'SUPER_ADMIN',
        ],
      },

      {
        label: 'Member Management',
        to: '/admin/members',
        icon: Users,
        roles: [
          'COOPERATIVE_LEADER',
          'ADMIN',
          'SUPER_ADMIN',
        ],
      },

      {
        label: 'Meeting Management',
        to: '/admin/meetings',
        icon: CalendarClock,
        roles: [
          'COOPERATIVE_LEADER',
          'ADMIN',
          'SUPER_ADMIN',
        ],
      },

      {
        label: 'Event Management',
        to: '/admin/events',
        icon: CalendarDays,
        roles: [
          'COOPERATIVE_LEADER',
          'ADMIN',
          'SUPER_ADMIN',
        ],
      },

      {
        label: 'Savings Management',
        to: '/admin/savings',
        icon: PiggyBank,
      },

      {
        label: 'Welfare Management',
        to: '/admin/welfare',
        icon: HeartHandshake,
      },

      {
        label: 'Financial Management',
        to: '/admin/finance',
        icon: Landmark,
      },

      {
        label: 'Reports',
        to: '/admin/reports',
        icon: BarChart3,
      },

      {
        label: 'Audit Trail',
        to: '/admin/audit',
        icon: ScrollText,
        roles: ['ADMIN', 'SUPER_ADMIN'],
      },

      {
        label: 'Roles & Permissions',
        to: '/admin/roles',
        icon: ShieldCheck,
        roles: ['ADMIN', 'SUPER_ADMIN'],
      },

      {
        label: 'System Settings',
        to: '/admin/settings',
        icon: UserCog,
        roles: ['ADMIN', 'SUPER_ADMIN'],
      },
    ],
  },
]

export function getVisibleNavGroups(
  role: Role,
): NavGroup[] {
  return NAV_GROUPS.filter(
    (group) =>
      !group.roles || group.roles.includes(role),
  )
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          !item.roles || item.roles.includes(role),
      ),
    }))
    .filter((group) => group.items.length > 0)
}
