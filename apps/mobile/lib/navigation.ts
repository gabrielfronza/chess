export const publicRoutes = ['/welcome', '/login'] as const;

export const authenticatedTabs = [
  'home',
  'tournaments',
  'wallet',
  'history',
  'profile',
] as const;

export const authenticatedRoutes = ['/onboarding'] as const;

export function createTournamentDetailHref(
  id: string,
): `/tournaments/${string}` {
  return `/tournaments/${encodeURIComponent(id)}`;
}
