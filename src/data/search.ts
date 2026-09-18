import { cooperativeEvents } from '@/data/events'
import { loans } from '@/data/loans'
import { members } from '@/data/members'
import { transactions } from '@/data/transactions'

export interface SearchResult {
  id: string
  category:
    'Members' | 'Transactions' | 'Loans' | 'Events' | 'Reports' | 'Documents'
  title: string
  subtitle: string
  to: string
}

const staticEntries: SearchResult[] = [
  {
    id: 'doc-constitution',
    category: 'Documents',
    title: 'Cooperative Constitution',
    subtitle: 'Governance document',
    to: '/governance/constitution',
  },
  {
    id: 'doc-savings-statement',
    category: 'Documents',
    title: 'Savings Statement',
    subtitle: 'Personal statement',
    to: '/statements/savings',
  },
  {
    id: 'doc-loan-statement',
    category: 'Documents',
    title: 'Loan Statement',
    subtitle: 'Personal statement',
    to: '/statements/loans',
  },
  {
    id: 'report-financial',
    category: 'Reports',
    title: 'Financial Report',
    subtitle: 'Cooperative-wide report',
    to: '/admin/reports/financial',
  },
  {
    id: 'report-savings',
    category: 'Reports',
    title: 'Savings Report',
    subtitle: 'Cooperative-wide report',
    to: '/admin/reports/savings',
  },
  {
    id: 'report-loans',
    category: 'Reports',
    title: 'Loan Report',
    subtitle: 'Cooperative-wide report',
    to: '/admin/reports/loans',
  },
]

/** A single flattened, client-searchable index built from the mock data layer — stands in for a real search endpoint. */
export const searchIndex: SearchResult[] = [
  ...members.map((member) => ({
    id: member.id,
    category: 'Members' as const,
    title: member.name,
    subtitle: `${member.memberNumber} · ${member.branch}`,
    to: `/admin/members/${member.id}`,
  })),
  ...transactions.map((transaction) => ({
    id: transaction.id,
    category: 'Transactions' as const,
    title: transaction.description,
    subtitle: `${transaction.reference} · ${transaction.memberName}`,
    to: '/transactions',
  })),
  ...loans.map((loan) => ({
    id: loan.id,
    category: 'Loans' as const,
    title: `${loan.type} — ${loan.memberName}`,
    subtitle: `${loan.reference} · ${loan.status}`,
    to: `/loans/${loan.id}`,
  })),
  ...cooperativeEvents.map((event) => ({
    id: event.id,
    category: 'Events' as const,
    title: event.title,
    subtitle: `${event.date} · ${event.location}`,
    to: '/events',
  })),
  ...staticEntries,
]

export function searchAll(query: string): SearchResult[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []
  return searchIndex
    .filter(
      (item) =>
        item.title.toLowerCase().includes(needle) ||
        item.subtitle.toLowerCase().includes(needle),
    )
    .slice(0, 20)
}
