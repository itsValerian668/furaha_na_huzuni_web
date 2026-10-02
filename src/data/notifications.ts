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
    category: 'Community',
    title: 'New cooperative meeting scheduled',
    message:
      'The Annual General Meeting has been scheduled for 28 September at the Kinondoni Hall.',
    date: '2026-09-02T11:45:00',
    read: true,
  },
  {
    id: 'NT-03',
    category: 'Community',
    title: 'Welfare fund milestone',
    message:
      'Together, members have supported 38 people this year through the welfare fund.',
    date: '2026-08-30T08:00:00',
    read: true,
  },
  {
    id: 'NT-04',
    category: 'System',
    title: 'Profile verification complete',
    message:
      'Your member profile and documents have been verified successfully.',
    date: '2026-08-27T16:20:00',
    read: true,
  },
]