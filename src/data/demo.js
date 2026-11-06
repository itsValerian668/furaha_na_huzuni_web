export const demoRequests = [
  {
    id: 1,
    title: 'Medical support for Mama Neema',
    status: 'verified',
    category: { name: 'Medical' },
    user: { name: 'Asha Mwakalindile' },
    current_amount: 1850000,
    target_amount: 2500000,
    created_at: '2026-10-28T09:30:00Z',
  },
  {
    id: 2,
    title: 'School fees for Baraka’s children',
    status: 'verified',
    category: { name: 'Education' },
    user: { name: 'Baraka Mushi' },
    current_amount: 920000,
    target_amount: 1500000,
    created_at: '2026-10-22T13:15:00Z',
  },
  {
    id: 3,
    title: 'Emergency home repair after the rains',
    status: 'pending',
    category: { name: 'Emergency' },
    user: { name: 'Fatuma Rajabu' },
    current_amount: 410000,
    target_amount: 1000000,
    created_at: '2026-10-30T16:45:00Z',
  },
  {
    id: 4,
    title: 'Family support following bereavement',
    status: 'verified',
    category: { name: 'Welfare' },
    user: { name: 'Omary Chande' },
    current_amount: 700000,
    target_amount: 700000,
    created_at: '2026-10-12T11:00:00Z',
  },
];

export const demoDues = [
  { id: 1, amount: 25000, status: 'paid', paid_at: '2026-10-05', dues_schedule: { month: 10, year: 2026 } },
  { id: 2, amount: 25000, status: 'pending', paid_at: null, dues_schedule: { month: 11, year: 2026 } },
  { id: 3, amount: 25000, status: 'pending', paid_at: null, dues_schedule: { month: 12, year: 2026 } },
];

export const demoContributions = [
  { id: 1, amount: 50000, status: 'completed', created_at: '2026-10-29', request: demoRequests[0] },
  { id: 2, amount: 25000, status: 'completed', created_at: '2026-10-24', request: demoRequests[1] },
  { id: 3, amount: 10000, status: 'pending', created_at: '2026-10-31', request: demoRequests[2] },
];

export const demoAdminStats = {
  members: { total: 128, admins: 8 },
  requests: { pending: 12, verified: 46, closed: 31, rejected: 4 },
  contributions: { total_completed_amount: 18450000, total_completed_count: 214, pending_count: 18 },
  dues: {
    all_time_collected: 42600000,
    current_schedule: { month: 11, year: 2026, amount_per_member: 25000, paid_count: 96, pending_count: 32, total_collected: 2400000, total_expected: 3200000 },
  },
};

export const demoActivity = {
  recent_requests: demoRequests.slice(0, 3),
  recent_contributions: demoContributions,
};

export const demoProfile = {
  memberNumber: 'FH-2020-0001',
  phone: '+255 754 210 887',
  joined: '14 March 2020',
  branch: 'Dar es Salaam — Kinondoni',
  status: 'Active',
};

export const demoPayments = [
  { id: 'PAY-2026-0118', date: '2026-11-02', description: 'Wedding support payout', recipient: 'Neema Joseph', amount: 850000, method: 'M-Pesa', status: 'paid' },
  { id: 'PAY-2026-0104', date: '2026-10-04', description: 'Funeral support payout', recipient: 'Omary Chande', amount: 650000, method: 'Bank transfer', status: 'paid' },
  { id: 'PAY-2026-0092', date: '2026-09-06', description: 'Graduation support payout', recipient: 'Baraka Mushi', amount: 500000, method: 'M-Pesa', status: 'paid' },
  { id: 'PAY-2026-0076', date: '2026-08-05', description: 'Child birth support payout', recipient: 'Asha Mwakalindile', amount: 350000, method: 'M-Pesa', status: 'paid' },
];

export const demoMembers = [
  { id: 'MB-0001', name: 'Valerian Victor', email: 'valerian.victor@example.com', phone: '+255 754 210 887', nationalId: '19900314-12345-00001-11', bankName: 'NMB Bank', accountName: 'Valerian Victor', accountNumber: 'NMB-0012345678', role: 'Admin + Member', status: 'Active', contributions: 2450000, requests: 3 },
  { id: 'MB-0002', name: 'Asha Mwakalindile', email: 'asha.mwakalindile@example.com', phone: '+255 713 552 019', nationalId: '19940602-22341-00002-22', bankName: 'CRDB Bank', accountName: 'Asha Mwakalindile', accountNumber: 'CRDB-0023456789', role: 'Member', status: 'Active', contributions: 4120000, requests: 2 },
  { id: 'MB-0003', name: 'Baraka Mushi', email: 'baraka.mushi@example.com', phone: '+255 655 883 401', nationalId: '19880120-33452-00003-33', bankName: 'NBC Bank', accountName: 'Baraka Mushi', accountNumber: 'NBC-0034567890', role: 'Member', status: 'Active', contributions: 1860000, requests: 1 },
  { id: 'MB-0004', name: 'Fatuma Rajabu', email: 'fatuma.rajabu@example.com', phone: '+255 622 940 118', nationalId: '19921109-44563-00004-44', bankName: 'NMB Bank', accountName: 'Fatuma Rajabu', accountNumber: 'NMB-0045678901', role: 'Member', status: 'Inactive', contributions: 5680000, requests: 4 },
];

export const demoMeetings = [
  { id: 1, title: 'November General Meeting', date: '2026-11-21', time: '10:00', venue: 'Kinondoni Community Hall', invitees: 128, status: 'Scheduled' },
  { id: 2, title: 'Welfare Committee Review', date: '2026-11-14', time: '14:00', venue: 'Online — Google Meet', invitees: 12, status: 'Pending invitations' },
];
