export const tournamentStatuses = [
  'DRAFT',
  'PUBLISHED',
  'REGISTRATION_CLOSED',
  'RUNNING',
  'FINISHED',
  'CANCELLED',
] as const;

export type { TournamentStatus } from '@checkmatetour/contracts';

export const refundStatuses = ['NONE', 'PENDING'] as const;
export type RefundStatus = (typeof refundStatuses)[number];
