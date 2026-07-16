import type { UserRole } from '@checkmatetour/contracts';

export const userRoles = [
  'USER',
  'ADMIN',
] as const satisfies readonly UserRole[];

export type { UserRole } from '@checkmatetour/contracts';
