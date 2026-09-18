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

import { SharesPage } from '@/pages/shares/SharesPage'
import { SharesHistoryPage } from '@/pages/shares/SharesHistoryPage'

import { LoansPage } from '@/pages/loans/LoansPage'
import { LoanApplyPage } from '@/pages/loans/LoanApplyPage'
import { LoanDetailPage } from '@/pages/loans/LoanDetailPage'
import { LoanRepaymentsPage } from '@/pages/loans/LoanRepaymentsPage'
import { LoanHistoryPage } from '@/pages/loans/LoanHistoryPage'

import { WelfarePage } from '@/pages/welfare/WelfarePage'
import { WelfareRequestsPage } from '@/pages/welfare/WelfareRequestsPage'
import { WelfareHistoryPage } from '@/pages/welfare/WelfareHistoryPage'

import { DividendsPage } from '@/pages/dividends/DividendsPage'
import { DividendsHistoryPage } from '@/pages/dividends/DividendsHistoryPage'
import { DividendDetailPage } from '@/pages/dividends/DividendDetailPage'

import { TransactionsPage } from '@/pages/transactions/TransactionsPage'

import { StatementsPage } from '@/pages/statements/StatementsPage'
import { StatementsSavingsPage } from '@/pages/statements/StatementsSavingsPage'
import { StatementsLoansPage } from '@/pages/statements/StatementsLoansPage'
import { StatementsSharesPage } from '@/pages/statements/StatementsSharesPage'

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
import { AdminSharesPage } from '@/pages/admin/AdminSharesPage'
import { AdminLoansPage } from '@/pages/admin/AdminLoansPage'
import { AdminLoanDetailPage } from '@/pages/admin/AdminLoanDetailPage'
import { AdminWelfarePage } from '@/pages/admin/AdminWelfarePage'
import { AdminDividendsPage } from '@/pages/admin/AdminDividendsPage'
import { AdminFinancePage } from '@/pages/admin/AdminFinancePage'
import { AdminReportsIndexPage } from '@/pages/admin/reports/AdminReportsIndexPage'
import { AdminReportsSavingsPage } from '@/pages/admin/reports/AdminReportsSavingsPage'
import { AdminReportsLoansPage } from '@/pages/admin/reports/AdminReportsLoansPage'
import { AdminReportsMembersPage } from '@/pages/admin/reports/AdminReportsMembersPage'
import { AdminReportsDividendsPage } from '@/pages/admin/reports/AdminReportsDividendsPage'
import { AdminReportsFinancialPage } from '@/pages/admin/reports/AdminReportsFinancialPage'
import { AdminAuditPage } from '@/pages/admin/AdminAuditPage'
import { AdminRolesPage } from '@/pages/admin/AdminRolesPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'

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
          { path: '/savings/history', element: <SavingsHistoryPage /> },
          { path: '/savings/goals', element: <SavingsGoalsPage /> },
          {
            path: '/savings/contributions',
            element: <SavingsContributionsPage />,
          },

          { path: '/shares', element: <SharesPage /> },
          { path: '/shares/history', element: <SharesHistoryPage /> },

          { path: '/loans', element: <LoansPage /> },
          { path: '/loans/apply', element: <LoanApplyPage /> },
          { path: '/loans/repayments', element: <LoanRepaymentsPage /> },
          { path: '/loans/history', element: <LoanHistoryPage /> },
          { path: '/loans/:id', element: <LoanDetailPage /> },

          { path: '/welfare', element: <WelfarePage /> },
          { path: '/welfare/requests', element: <WelfareRequestsPage /> },
          { path: '/welfare/history', element: <WelfareHistoryPage /> },

          { path: '/dividends', element: <DividendsPage /> },
          { path: '/dividends/history', element: <DividendsHistoryPage /> },
          { path: '/dividends/:id', element: <DividendDetailPage /> },

          { path: '/transactions', element: <TransactionsPage /> },

          { path: '/statements', element: <StatementsPage /> },
          { path: '/statements/savings', element: <StatementsSavingsPage /> },
          { path: '/statements/loans', element: <StatementsLoansPage /> },
          { path: '/statements/shares', element: <StatementsSharesPage /> },

          { path: '/profile', element: <ProfilePage /> },
          { path: '/notifications', element: <NotificationsPage /> },

          { path: '/governance', element: <GovernancePage /> },
          { path: '/governance/constitution', element: <ConstitutionPage /> },
          { path: '/governance/leaders', element: <LeadersPage /> },
          { path: '/governance/meetings', element: <MeetingsPage /> },
          { path: '/governance/elections', element: <ElectionsPage /> },
          { path: '/governance/resolutions', element: <ResolutionsPage /> },

          { path: '/events', element: <EventsPage /> },

          { path: '/admin', element: <AdminDashboardPage /> },
          { path: '/admin/members', element: <AdminMembersPage /> },
          { path: '/admin/members/:id', element: <AdminMemberDetailPage /> },
          { path: '/admin/savings', element: <AdminSavingsPage /> },
          { path: '/admin/shares', element: <AdminSharesPage /> },
          { path: '/admin/loans', element: <AdminLoansPage /> },
          { path: '/admin/loans/:id', element: <AdminLoanDetailPage /> },
          { path: '/admin/welfare', element: <AdminWelfarePage /> },
          { path: '/admin/dividends', element: <AdminDividendsPage /> },
          { path: '/admin/finance', element: <AdminFinancePage /> },
          { path: '/admin/reports', element: <AdminReportsIndexPage /> },
          {
            path: '/admin/reports/savings',
            element: <AdminReportsSavingsPage />,
          },
          { path: '/admin/reports/loans', element: <AdminReportsLoansPage /> },
          {
            path: '/admin/reports/members',
            element: <AdminReportsMembersPage />,
          },
          {
            path: '/admin/reports/dividends',
            element: <AdminReportsDividendsPage />,
          },
          {
            path: '/admin/reports/financial',
            element: <AdminReportsFinancialPage />,
          },
          { path: '/admin/audit', element: <AdminAuditPage /> },
          { path: '/admin/roles', element: <AdminRolesPage /> },
          { path: '/admin/settings', element: <AdminSettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
