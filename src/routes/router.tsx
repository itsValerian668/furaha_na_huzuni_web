import { Navigate, createBrowserRouter } from 'react-router-dom'

import { AuthPage } from '@/features/auth/pages/AuthPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { NotFoundPage } from '@/pages/NotFoundPage'

import { SavingsPage } from '@/pages/savings/SavingsPage'
import { SavingsHistoryPage } from '@/pages/savings/SavingsHistoryPage'
import { SavingsGoalsPage } from '@/pages/savings/SavingsGoalsPage'
import { SavingsContributionsPage } from '@/pages/savings/SavingsContributionsPage'

import { WelfarePage } from '@/pages/welfare/WelfarePage'
import { WelfareRequestsPage } from '@/pages/welfare/WelfareRequestsPage'
import { WelfareHistoryPage } from '@/pages/welfare/WelfareHistoryPage'

import { TransactionsPage } from '@/pages/transactions/TransactionsPage'

import { StatementsPage } from '@/pages/statements/StatementsPage'
import { StatementsSavingsPage } from '@/pages/statements/StatementsSavingsPage'

import { ProfilePage } from '@/pages/profile/ProfilePage'
import { NotificationsPage } from '@/pages/notifications/NotificationsPage'

import { GovernancePage } from '@/pages/governance/GovernancePage'
import { ConstitutionPage } from '@/pages/governance/ConstitutionPage'
import { LeadersPage } from '@/pages/governance/LeadersPage'
import { MeetingsPage } from '@/pages/governance/MeetingsPage'
import { ElectionsPage } from '@/pages/governance/ElectionsPage'
import { ResolutionsPage } from '@/pages/governance/ResolutionsPage'

import { EventsPage } from '@/pages/events/EventsPage'

import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminMembersPage } from '@/pages/admin/AdminMembersPage'
import { AdminMemberDetailPage } from '@/pages/admin/AdminMemberDetailPage'
import { AdminSavingsPage } from '@/pages/admin/AdminSavingsPage'
import { AdminWelfarePage } from '@/pages/admin/AdminWelfarePage'
import { AdminFinancePage } from '@/pages/admin/AdminFinancePage'
import { AdminReportsIndexPage } from '@/pages/admin/reports/AdminReportsIndexPage'
import { AdminReportsSavingsPage } from '@/pages/admin/reports/AdminReportsSavingsPage'
import { AdminReportsMembersPage } from '@/pages/admin/reports/AdminReportsMembersPage'
import { AdminReportsFinancialPage } from '@/pages/admin/reports/AdminReportsFinancialPage'
import { AdminAuditPage } from '@/pages/admin/AdminAuditPage'
import { AdminRolesPage } from '@/pages/admin/AdminRolesPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'
import { AdminLeadersPage } from '@/pages/admin/AdminLeadersPage'
import { AdminMeetingsPage } from '@/pages/admin/AdminMeetingsPage'
import { AdminEventsPage } from '@/pages/admin/AdminEventsPage'

import { ProtectedRoute } from '@/routes/ProtectedRoute'

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [{ path: '/login', element: <AuthPage /> }],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },

          { path: '/dashboard', element: <DashboardPage /> },

          { path: '/savings', element: <SavingsPage /> },
          {
            path: '/savings/history',
            element: <SavingsHistoryPage />,
          },
          {
            path: '/savings/goals',
            element: <SavingsGoalsPage />,
          },
          {
            path: '/savings/contributions',
            element: <SavingsContributionsPage />,
          },

          { path: '/welfare', element: <WelfarePage /> },
          {
            path: '/welfare/requests',
            element: <WelfareRequestsPage />,
          },
          {
            path: '/welfare/history',
            element: <WelfareHistoryPage />,
          },

          {
            path: '/transactions',
            element: <TransactionsPage />,
          },

          {
            path: '/statements',
            element: <StatementsPage />,
          },
          {
            path: '/statements/savings',
            element: <StatementsSavingsPage />,
          },

          {
            path: '/profile',
            element: <ProfilePage />,
          },
          {
            path: '/notifications',
            element: <NotificationsPage />,
          },

          { path: '/governance', element: <GovernancePage /> },
          {
            path: '/governance/constitution',
            element: <ConstitutionPage />,
          },
          {
            path: '/governance/leaders',
            element: <LeadersPage />,
          },
          {
            path: '/governance/meetings',
            element: <MeetingsPage />,
          },
          {
            path: '/governance/elections',
            element: <ElectionsPage />,
          },
          {
            path: '/governance/resolutions',
            element: <ResolutionsPage />,
          },

          { path: '/events', element: <EventsPage /> },

          {
            path: '/admin',
            element: <AdminDashboardPage />,
          },

          {
            element: (
              <ProtectedRoute
                allowedRoles={[
                  'COOPERATIVE_LEADER',
                  'ADMIN',
                  'SUPER_ADMIN',
                ]}
              />
            ),
            children: [
              {
                path: '/admin/members',
                element: <AdminMembersPage />,
              },
              {
                path: '/admin/members/:id',
                element: <AdminMemberDetailPage />,
              },
              {
                path: '/admin/events',
                element: <AdminEventsPage />,
              },
            ],
          },

          {
            path: '/admin/leaders',
            element: <AdminLeadersPage />,
          },
          {
            path: '/admin/meetings',
            element: <AdminMeetingsPage />,
          },
          {
            path: '/admin/savings',
            element: <AdminSavingsPage />,
          },
          {
            path: '/admin/welfare',
            element: <AdminWelfarePage />,
          },
          {
            path: '/admin/finance',
            element: <AdminFinancePage />,
          },
          {
            path: '/admin/reports',
            element: <AdminReportsIndexPage />,
          },
          {
            path: '/admin/reports/savings',
            element: <AdminReportsSavingsPage />,
          },
          {
            path: '/admin/reports/members',
            element: <AdminReportsMembersPage />,
          },
          {
            path: '/admin/reports/financial',
            element: <AdminReportsFinancialPage />,
          },
          {
            path: '/admin/audit',
            element: <AdminAuditPage />,
          },
          {
            path: '/admin/roles',
            element: <AdminRolesPage />,
          },
          {
            path: '/admin/settings',
            element: <AdminSettingsPage />,
          },
        ],
      },
    ],
  },

  {
    path: '*',
    element: <NotFoundPage />,
  },
])
