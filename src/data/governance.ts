import type {
  ConstitutionSection,
  ElectionPosition,
  Leader,
  Meeting,
} from '@/types/coop'

export const leaders: Leader[] = [
  {
    id: 'LD-01',
    name: 'Asha Mwakalindile',
    position: 'Chairperson',
    committee: 'Executive',
    since: '2023-01-15',
    avatarColor: '#0B6655',
  },
  {
    id: 'LD-02',
    name: 'Grace Mollel',
    position: 'Secretary',
    committee: 'Executive',
    since: '2022-01-15',
    avatarColor: '#159A78',
  },
  {
    id: 'LD-03',
    name: 'Fatuma Rajabu',
    position: 'Treasurer',
    committee: 'Executive',
    since: '2021-01-15',
    avatarColor: '#C9A45C',
  },
  {
    id: 'LD-04',
    name: 'Baraka Mushi',
    position: 'Chairperson',
    committee: 'Loan Committee',
    since: '2023-01-15',
    avatarColor: '#0B6655',
  },
  {
    id: 'LD-05',
    name: 'Edwin Materu',
    position: 'Member',
    committee: 'Loan Committee',
    since: '2023-01-15',
    avatarColor: '#159A78',
  },
  {
    id: 'LD-06',
    name: 'Zawadi Lyimo',
    position: 'Chairperson',
    committee: 'Welfare Committee',
    since: '2022-06-01',
    avatarColor: '#C9A45C',
  },
  {
    id: 'LD-07',
    name: 'Upendo Mgaya',
    position: 'Member',
    committee: 'Welfare Committee',
    since: '2022-06-01',
    avatarColor: '#0B6655',
  },
  {
    id: 'LD-08',
    name: 'Salum Abdallah',
    position: 'Chairperson',
    committee: 'Supervisory Committee',
    since: '2024-01-15',
    avatarColor: '#159A78',
  },
]

export const meetings: Meeting[] = [
  {
    id: 'MT-01',
    title: 'Annual General Meeting 2026',
    type: 'AGM',
    date: '2026-09-28',
    location: 'Kinondoni Community Hall, Dar es Salaam',
    status: 'UPCOMING',
    minutesAvailable: false,
    agenda: [
      'Chairperson opening remarks',
      "Presentation of the treasurer's annual financial report",
      'Approval of the FY2026 dividend distribution',
      'Election of two committee positions',
      'Approval of the FY2027 savings and loan policy amendments',
    ],
  },
  {
    id: 'MT-02',
    title: 'Loan Committee Review',
    type: 'Committee',
    date: '2026-09-16',
    location: 'Cooperative Office, Kinondoni',
    status: 'UPCOMING',
    minutesAvailable: false,
    agenda: ['Review pending loan applications', 'Overdue loan follow-up plan'],
  },
  {
    id: 'MT-03',
    title: 'Quarterly General Meeting — Q2 FY2026',
    type: 'Regular',
    date: '2026-06-14',
    location: 'Kinondoni Community Hall, Dar es Salaam',
    status: 'PAST',
    attendance: 412,
    minutesAvailable: true,
    agenda: ['Q2 financial performance', 'Welfare fund update', 'Member Q&A'],
  },
  {
    id: 'MT-04',
    title: 'Welfare Committee Emergency Session',
    type: 'Emergency',
    date: '2026-05-02',
    location: 'Cooperative Office, Kinondoni',
    status: 'PAST',
    attendance: 6,
    minutesAvailable: true,
    agenda: ['Urgent medical support request review'],
  },
  {
    id: 'MT-05',
    title: 'Quarterly General Meeting — Q1 FY2026',
    type: 'Regular',
    date: '2026-03-08',
    location: 'Kinondoni Community Hall, Dar es Salaam',
    status: 'PAST',
    attendance: 388,
    minutesAvailable: true,
    agenda: ['Q1 financial performance', 'Constitution amendment proposal'],
  },
]

export const electionPositions: ElectionPosition[] = [
  {
    id: 'EL-01',
    title: 'Chairperson',
    status: 'OPEN',
    closesOn: '2026-09-27',
    candidates: [
      {
        id: 'C-01',
        name: 'Asha Mwakalindile',
        statement: 'Continuing to strengthen transparency and member services.',
        votes: 214,
      },
      {
        id: 'C-02',
        name: 'Salum Abdallah',
        statement: 'Focused on expanding branch access and digital services.',
        votes: 176,
      },
    ],
  },
  {
    id: 'EL-02',
    title: 'Secretary',
    status: 'OPEN',
    closesOn: '2026-09-27',
    candidates: [
      {
        id: 'C-03',
        name: 'Grace Mollel',
        statement: 'Improving record-keeping and meeting communication.',
        votes: 260,
      },
      {
        id: 'C-04',
        name: 'Josephine Kessy',
        statement: 'Bringing fresh energy to member engagement.',
        votes: 98,
      },
    ],
  },
  {
    id: 'EL-03',
    title: 'Treasurer',
    status: 'OPEN',
    closesOn: '2026-09-27',
    candidates: [
      {
        id: 'C-05',
        name: 'Fatuma Rajabu',
        statement: 'Maintaining disciplined, transparent financial management.',
        votes: 301,
      },
    ],
  },
]

export interface Resolution {
  id: string
  title: string
  meeting: string
  date: string
  status: 'PASSED' | 'PENDING' | 'REJECTED'
  summary: string
}

export const resolutions: Resolution[] = [
  {
    id: 'RS-01',
    title: 'Approve FY2025 Annual Dividend Distribution',
    meeting: 'Annual General Meeting 2025',
    date: '2025-09-20',
    status: 'PASSED',
    summary:
      'Approved distribution of TSh 34,920,000 to eligible members in proportion to shares held.',
  },
  {
    id: 'RS-02',
    title: 'Increase Minimum Weekly Savings Contribution',
    meeting: 'Quarterly General Meeting — Q1 FY2026',
    date: '2026-03-08',
    status: 'PASSED',
    summary:
      'Minimum weekly contribution raised from TSh 30,000 to TSh 50,000 effective April 2026.',
  },
  {
    id: 'RS-03',
    title: 'Amend Loan Policy — Development Loan Term Extension',
    meeting: 'Quarterly General Meeting — Q2 FY2026',
    date: '2026-06-14',
    status: 'PASSED',
    summary: 'Maximum Development Loan term extended from 24 to 36 months.',
  },
  {
    id: 'RS-04',
    title: 'Approve FY2026 Annual Dividend Distribution',
    meeting: 'Annual General Meeting 2026',
    date: '2026-09-28',
    status: 'PENDING',
    summary:
      'Proposed distribution of TSh 38,880,000 to eligible members, pending AGM approval.',
  },
]

export const constitutionSections: ConstitutionSection[] = [
  {
    id: 'CS-01',
    number: 1,
    title: 'Purpose',
    content: [
      'Furaha na Huzuni Cooperative exists so that members can save together, build shared capital through shares, access affordable credit, and stand together through both joyful occasions and hardship.',
      'The cooperative is owned and governed by its members, operating on principles of mutual self-help, transparency and democratic control.',
    ],
  },
  {
    id: 'CS-02',
    number: 2,
    title: 'Membership',
    content: [
      'Membership is open to any individual who subscribes to at least one share, pays the registration fee, and agrees to abide by this constitution.',
      'Members in good standing are entitled to vote at general meetings, stand for leadership positions, access savings and loan products, and receive dividends and welfare support.',
    ],
  },
  {
    id: 'CS-03',
    number: 3,
    title: 'Savings',
    content: [
      'Members contribute to their savings account on a weekly basis at a minimum contribution set by the annual general meeting.',
      'Savings remain the property of the member and may be withdrawn subject to the notice periods set out in the Savings Rules.',
    ],
  },
  {
    id: 'CS-04',
    number: 4,
    title: 'Shares',
    content: [
      'Shares represent a member’s ownership stake in the cooperative and form part of its permanent capital.',
      'Share capital is not withdrawable while a member remains active, but may be transferred to another member with committee approval.',
    ],
  },
  {
    id: 'CS-05',
    number: 5,
    title: 'Loans',
    content: [
      'Members may apply for credit once eligibility requirements — including minimum savings tenure and good standing — are met.',
      'All loans are reviewed by the Loan Committee and disbursed according to the approved Loan Policy.',
    ],
  },
  {
    id: 'CS-06',
    number: 6,
    title: 'Leadership',
    content: [
      'The cooperative is led by an elected Executive Committee comprising a Chairperson, Secretary and Treasurer, supported by the Loan, Welfare and Supervisory Committees.',
      'Leaders serve two-year terms and may be re-elected for a maximum of two consecutive terms.',
    ],
  },
  {
    id: 'CS-07',
    number: 7,
    title: 'Meetings',
    content: [
      'An Annual General Meeting is held each year to review performance, approve the dividend, and elect leaders as required.',
      'Quarterly General Meetings keep members informed of financial performance between annual meetings.',
    ],
  },
  {
    id: 'CS-08',
    number: 8,
    title: 'Elections',
    content: [
      'Elections are conducted by secret ballot among members in good standing, overseen by the Supervisory Committee.',
      'Any member in good standing for at least two years may stand for a leadership position.',
    ],
  },
  {
    id: 'CS-09',
    number: 9,
    title: 'Welfare',
    content: [
      'A portion of member contributions funds the Welfare Fund, which provides mutual support during medical emergencies, bereavement, and other hardships.',
      'Requests are reviewed by the Welfare Committee against the categories and limits set in the Welfare Policy.',
    ],
  },
  {
    id: 'CS-10',
    number: 10,
    title: 'Dividends',
    content: [
      'Annual surplus, after statutory reserves, is distributed to members as dividends in proportion to shares held.',
      'Dividend distribution is approved at the Annual General Meeting on the Treasurer’s recommendation.',
    ],
  },
  {
    id: 'CS-11',
    number: 11,
    title: 'Dispute Resolution',
    content: [
      'Disputes between members, or between a member and the cooperative, are first referred to the Executive Committee for mediation.',
      'Unresolved disputes may be escalated to the cooperative regulator in accordance with national cooperative law.',
    ],
  },
  {
    id: 'CS-12',
    number: 12,
    title: 'Amendments',
    content: [
      'This constitution may be amended by a two-thirds majority vote of members present at a General Meeting, provided the proposed changes were circulated at least 30 days in advance.',
    ],
  },
]
