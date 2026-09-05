import type { Bounty } from '@/types/bounty'

export const MOCK_BOUNTIES: Bounty[] = [
  {
    id: '1',
    title: 'Fix XDR decoding bug in transaction parsing',
    description:
      'The XDR decoder throws an uncaught exception on malformed input instead of returning a structured error. Needs proper error handling and unit tests.',
    repoUrl: 'https://github.com/stellar/js-stellar-sdk',
    issueUrl: 'https://github.com/stellar/js-stellar-sdk/issues/842',
    issueNumber: 842,
    repoName: 'stellar/js-stellar-sdk',
    organization: 'Stellar Development Foundation',
    status: 'open',
    reward: 500,
    token: 'USDC',
    tags: ['bug', 'typescript', 'xdr', 'good-first-issue'],
    postedBy: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234567890ABCD',
    claimedBy: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    milestonesTotal: 3,
    milestonesCompleted: 0,
  },
  {
    id: '2',
    title: 'Add Soroban smart contract integration tests',
    description:
      'We need a full integration test suite for the escrow contract covering deposit, claim, dispute, and refund flows.',
    repoUrl: 'https://github.com/stellar/soroban-examples',
    issueUrl: 'https://github.com/stellar/soroban-examples/issues/210',
    issueNumber: 210,
    repoName: 'stellar/soroban-examples',
    organization: 'Stellar Development Foundation',
    status: 'claimed',
    reward: 1500,
    token: 'XLM',
    tags: ['soroban', 'testing', 'rust', 'smart-contract'],
    postedBy: 'GXYZ1234ABCD5678EFGH9012IJKL3456MNOP7890QRST1234UVWX',
    claimedBy: 'GCLAIMR1234ABCD5678EFGH9012IJKL3456MNOP7890QRST1234',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    milestonesTotal: 4,
    milestonesCompleted: 1,
  },
  {
    id: '3',
    title: 'Implement path payment strict send UI',
    description:
      'Build a UI component for path payment strict send transactions in the Stellar wallet reference implementation.',
    repoUrl: 'https://github.com/stellar/freighter',
    issueUrl: 'https://github.com/stellar/freighter/issues/567',
    issueNumber: 567,
    repoName: 'stellar/freighter',
    organization: 'Stellar Development Foundation',
    status: 'in_review',
    reward: 750,
    token: 'USDC',
    tags: ['frontend', 'react', 'payments', 'ux'],
    postedBy: 'GREVIEW1234ABCD5678EFGH9012IJKL3456MNOP7890QRST123',
    claimedBy: 'GSUBMIT1234ABCD5678EFGH9012IJKL3456MNOP7890QRST123',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: null,
    milestonesTotal: 2,
    milestonesCompleted: 2,
  },
  {
    id: '4',
    title: 'Document Horizon API rate limiting behaviour',
    description:
      'Write clear documentation on Horizon rate limits, retry strategies, and how to handle 429 responses.',
    repoUrl: 'https://github.com/stellar/stellar-docs',
    issueUrl: 'https://github.com/stellar/stellar-docs/issues/331',
    issueNumber: 331,
    repoName: 'stellar/stellar-docs',
    organization: 'Stellar Development Foundation',
    status: 'completed',
    reward: 200,
    token: 'XLM',
    tags: ['docs', 'horizon', 'api'],
    postedBy: 'GDOCS1234ABCD5678EFGH9012IJKL3456MNOP7890QRST1234UV',
    claimedBy: 'GWRITER1234ABCD5678EFGH9012IJKL3456MNOP7890QRST12',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: null,
    milestonesTotal: 1,
    milestonesCompleted: 1,
  },
  {
    id: '5',
    title: 'Fix memory leak in Stellar Base keypair generation',
    description:
      'Profiling shows a memory leak when generating large batches of keypairs. Root cause traced to event listener not being cleaned up.',
    repoUrl: 'https://github.com/stellar/stellar-base',
    issueUrl: 'https://github.com/stellar/stellar-base/issues/174',
    issueNumber: 174,
    repoName: 'stellar/stellar-base',
    organization: 'Stellar Development Foundation',
    status: 'disputed',
    reward: 300,
    token: 'USDC',
    tags: ['bug', 'performance', 'memory', 'javascript'],
    postedBy: 'GDISPUTE1234ABCD5678EFGH9012IJKL3456MNOP7890QRST1',
    claimedBy: 'GCLAIM2134ABCD5678EFGH9012IJKL3456MNOP7890QRST123',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    milestonesTotal: 2,
    milestonesCompleted: 1,
  },
]

import type { TimelineEvent } from '@/types/timeline'

export const MOCK_TIMELINE: Record<string, TimelineEvent[]> = {
  '1': [
    {
      id: 'e1',
      type: 'created',
      actor: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234567890ABCD',
      message: 'Bounty posted with 500 USDC reward and 3 milestones.',
      txHash: 'abc123def456abc123def456abc123def456abc123def456abc123de',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  '2': [
    {
      id: 'e1',
      type: 'created',
      actor: 'GXYZ1234ABCD5678EFGH9012IJKL3456MNOP7890QRST1234UVWX',
      message: 'Bounty posted with 1500 XLM reward and 4 milestones.',
      txHash: 'bcd234efg567bcd234efg567bcd234efg567bcd234efg567bcd234ef',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'e2',
      type: 'claimed',
      actor: 'GCLAIMR1234ABCD5678EFGH9012IJKL3456MNOP7890QRST1234',
      message: 'Contributor claimed the bounty and began working.',
      txHash: 'cde345fgh678cde345fgh678cde345fgh678cde345fgh678cde345fg',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'e3',
      type: 'milestone_completed',
      actor: 'GCLAIMR1234ABCD5678EFGH9012IJKL3456MNOP7890QRST1234',
      message: 'Milestone 1: Escrow deposit flow implemented and tested.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  '3': [
    {
      id: 'e1',
      type: 'created',
      actor: 'GREVIEW1234ABCD5678EFGH9012IJKL3456MNOP7890QRST123',
      message: 'Bounty posted for path payment UI implementation.',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'e2',
      type: 'claimed',
      actor: 'GSUBMIT1234ABCD5678EFGH9012IJKL3456MNOP7890QRST123',
      message: 'Contributor claimed the bounty.',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'e3',
      type: 'milestone_completed',
      actor: 'GSUBMIT1234ABCD5678EFGH9012IJKL3456MNOP7890QRST123',
      message: 'Milestone 1 & 2 completed. UI components built and reviewed.',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'e4',
      type: 'work_submitted',
      actor: 'GSUBMIT1234ABCD5678EFGH9012IJKL3456MNOP7890QRST123',
      message: 'Final work submitted for review. PR linked in submission.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
}

export const MOCK_MILESTONES: Record<string, { id: string; title: string; completed: boolean; dueDate?: string }[]> = {
  '1': [
    { id: 'm1', title: 'Reproduce and document the bug', completed: false, dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'm2', title: 'Implement fix with proper error handling', completed: false, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'm3', title: 'Add unit tests and open PR', completed: false, dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() },
  ],
  '2': [
    { id: 'm1', title: 'Set up test harness and environment', completed: true },
    { id: 'm2', title: 'Write deposit and claim tests', completed: false, dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'm3', title: 'Write dispute and refund tests', completed: false, dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'm4', title: 'CI integration and documentation', completed: false },
  ],
  '3': [
    { id: 'm1', title: 'Build path payment UI components', completed: true },
    { id: 'm2', title: 'Wire up Stellar SDK and submit PR', completed: true },
  ],
}


import type { ContributorStats, ContributorActivity } from '@/types/profile'

export const MOCK_CONTRIBUTOR_STATS: Record<string, ContributorStats> = {
  'GCLAIMR1234ABCD5678EFGH9012IJKL3456MNOP7890QRST1234': {
    totalEarned: 3250,
    bountiesCompleted: 8,
    bountiesInProgress: 2,
    successRate: 88.9,
    averageCompletionTime: 4.2,
    reputationScore: 850,
    rank: 12,
  },
  'GSUBMIT1234ABCD5678EFGH9012IJKL3456MNOP7890QRST123': {
    totalEarned: 5100,
    bountiesCompleted: 14,
    bountiesInProgress: 1,
    successRate: 93.3,
    averageCompletionTime: 3.8,
    reputationScore: 1240,
    rank: 5,
  },
}

export const MOCK_CONTRIBUTOR_ACTIVITY: Record<string, ContributorActivity[]> = {
  'GCLAIMR1234ABCD5678EFGH9012IJKL3456MNOP7890QRST1234': [
    {
      id: 'a1',
      bountyId: '2',
      bountyTitle: 'Add Soroban smart contract integration tests',
      action: 'claimed',
      reward: 1500,
      token: 'XLM',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'a2',
      bountyId: '2',
      bountyTitle: 'Add Soroban smart contract integration tests',
      action: 'submitted',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'a3',
      bountyId: '6',
      bountyTitle: 'Optimize transaction throughput in Horizon',
      action: 'approved',
      reward: 800,
      token: 'USDC',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'a4',
      bountyId: '7',
      bountyTitle: 'Add multi-sig support to Freighter',
      action: 'approved',
      reward: 950,
      token: 'XLM',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  'GSUBMIT1234ABCD5678EFGH9012IJKL3456MNOP7890QRST123': [
    {
      id: 'a1',
      bountyId: '3',
      bountyTitle: 'Implement path payment strict send UI',
      action: 'submitted',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'a2',
      bountyId: '8',
      bountyTitle: 'Build SEP-24 deposit flow',
      action: 'approved',
      reward: 1200,
      token: 'USDC',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'a3',
      bountyId: '9',
      bountyTitle: 'Refactor SDK error handling',
      action: 'approved',
      reward: 600,
      token: 'XLM',
      timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
}


export interface LeaderboardEntry {
  rank: number
  address: string
  totalEarned: number
  bountiesCompleted: number
  successRate: number
  reputationScore: number
  change: number // rank change from last week (+/- or 0)
}

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    address: 'GTOP1ABCD1234EFGH5678IJKL9012MNOP3456QRST7890UVWX',
    totalEarned: 12500,
    bountiesCompleted: 32,
    successRate: 96.9,
    reputationScore: 2850,
    change: 0,
  },
  {
    rank: 2,
    address: 'GRANK2ABCD1234EFGH5678IJKL9012MNOP3456QRST7890UV',
    totalEarned: 10200,
    bountiesCompleted: 28,
    successRate: 93.3,
    reputationScore: 2340,
    change: 1,
  },
  {
    rank: 3,
    address: 'GTHIRD3ABCD1234EFGH5678IJKL9012MNOP3456QRST7890U',
    totalEarned: 8900,
    bountiesCompleted: 24,
    successRate: 95.8,
    reputationScore: 2120,
    change: -1,
  },
  {
    rank: 4,
    address: 'GFOURTH4ABCD1234EFGH5678IJKL9012MNOP3456QRST7890',
    totalEarned: 7100,
    bountiesCompleted: 21,
    successRate: 90.5,
    reputationScore: 1880,
    change: 2,
  },
  {
    rank: 5,
    address: 'GSUBMIT1234ABCD5678EFGH9012IJKL3456MNOP7890QRST123',
    totalEarned: 5100,
    bountiesCompleted: 14,
    successRate: 93.3,
    reputationScore: 1240,
    change: 0,
  },
  {
    rank: 6,
    address: 'GSIXTH6ABCD1234EFGH5678IJKL9012MNOP3456QRST78901',
    totalEarned: 4800,
    bountiesCompleted: 16,
    successRate: 87.5,
    reputationScore: 1150,
    change: -2,
  },
  {
    rank: 7,
    address: 'GSEVENTH7ABCD1234EFGH5678IJKL9012MNOP3456QRST78',
    totalEarned: 4500,
    bountiesCompleted: 13,
    successRate: 92.3,
    reputationScore: 1080,
    change: 1,
  },
  {
    rank: 8,
    address: 'GEIGHTH8ABCD1234EFGH5678IJKL9012MNOP3456QRST789',
    totalEarned: 4200,
    bountiesCompleted: 15,
    successRate: 86.7,
    reputationScore: 1020,
    change: 0,
  },
  {
    rank: 9,
    address: 'GNINTH9ABCD1234EFGH5678IJKL9012MNOP3456QRST7890',
    totalEarned: 3800,
    bountiesCompleted: 11,
    successRate: 90.9,
    reputationScore: 950,
    change: -1,
  },
  {
    rank: 10,
    address: 'GTENTH10ABCD1234EFGH5678IJKL9012MNOP3456QRST789',
    totalEarned: 3600,
    bountiesCompleted: 12,
    successRate: 91.7,
    reputationScore: 920,
    change: 3,
  },
  {
    rank: 11,
    address: 'GELEVEN11ABCD1234EFGH5678IJKL9012MNOP3456QRST7',
    totalEarned: 3400,
    bountiesCompleted: 10,
    successRate: 90.0,
    reputationScore: 870,
    change: 0,
  },
  {
    rank: 12,
    address: 'GCLAIMR1234ABCD5678EFGH9012IJKL3456MNOP7890QRST1234',
    totalEarned: 3250,
    bountiesCompleted: 8,
    successRate: 88.9,
    reputationScore: 850,
    change: -2,
  },
]


import type { Dispute } from '@/types/dispute'

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'd1',
    bountyId: '5',
    bountyTitle: 'Fix memory leak in Stellar Base keypair generation',
    poster: 'GDISPUTE1234ABCD5678EFGH9012IJKL3456MNOP7890QRST1',
    claimer: 'GCLAIM2134ABCD5678EFGH9012IJKL3456MNOP7890QRST123',
    reason: 'Work submitted does not address root cause. Memory leak still occurs in production environment after merge.',
    evidence: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    status: 'under_review',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    votesForPoster: 3,
    votesForClaimer: 1,
  },
  {
    id: 'd2',
    bountyId: '10',
    bountyTitle: 'Implement multi-currency support in DEX UI',
    poster: 'GPOSTER2ABCD5678EFGH9012IJKL3456MNOP7890QRST1234',
    claimer: 'GCLAIMER3ABCD5678EFGH9012IJKL3456MNOP7890QRST12',
    reason: 'Requirements were changed mid-development without prior agreement. Original scope was only XLM/USDC pair.',
    evidence: 'QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX',
    status: 'open',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    votesForPoster: 0,
    votesForClaimer: 2,
  },
  {
    id: 'd3',
    bountyId: '11',
    bountyTitle: 'Add SEP-10 authentication to anchor server',
    poster: 'GANCHOR1ABCD5678EFGH9012IJKL3456MNOP7890QRST123',
    claimer: 'GCONTRIB4ABCD5678EFGH9012IJKL3456MNOP7890QRST1',
    reason: 'Implementation complete and tested. Poster is unresponsive for 10+ days.',
    evidence: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    status: 'resolved_claimer',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    resolution: 'Poster failed to respond within dispute window. Funds released to claimer per protocol rules.',
    votesForPoster: 1,
    votesForClaimer: 5,
  },
]
