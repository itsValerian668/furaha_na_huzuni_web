import type { AppNotification } from '@/types/coop'

export const notifications: AppNotification[] = [
  {
    id: 'NT-01',
    category: 'Savings',
    title: 'Weekly contribution due',
    message:
      'Your weekly savings contribution of TSh 50,000 is due on Friday, 12 Sep.',
    date: '2026-09-10T07:30:00',
    read: false,
  },
  {
    id: 'NT-02',
    category: 'Loan',
    title: 'Loan repayment recorded',
    message:
      'Your repayment of TSh 100,000 for LN-2026-00482 was received and applied.',
    date: '2026-09-05T14:12:00',
    read: false,
  },
  {
    id: 'NT-03',
    category: 'Financial',
    title: 'Dividend distribution approved',
    message:
      'The FY2026 annual dividend distribution has been approved by the board.',
    date: '2026-09-03T09:00:00',
    read: false,
  },
  {
    id: 'NT-04',
    category: 'Community',
    title: 'New cooperative meeting scheduled',
    message:
      'The Annual General Meeting has been scheduled for 28 September at the Kinondoni Hall.',
    date: '2026-09-02T11:45:00',
    read: true,
  },
  {
    id: 'NT-05',
    category: 'Community',
    title: 'Welfare fund milestone',
    message:
      'Together, members have supported 38 people this year through the welfare fund.',
    date: '2026-08-30T08:00:00',
    read: true,
  },
  {
    id: 'NT-06',
    category: 'System',
    title: 'Profile verification complete',
    message:
      'Your member profile and documents have been verified successfully.',
    date: '2026-08-27T16:20:00',
    read: true,
  },
  {
    id: 'NT-07',
    category: 'Financial',
    title: 'Share purchase confirmed',
    message: 'Your purchase of 4 shares (TSh 20,000) has been confirmed.',
    date: '2026-09-01T10:05:00',
    read: true,
  },
  {
    id: 'NT-08',
    category: 'Loan',
    title: 'Loan application under review',
    message:
      'Your Business Loan application is being reviewed by the loan committee.',
    date: '2026-08-25T13:40:00',
    read: true,
  },
]
