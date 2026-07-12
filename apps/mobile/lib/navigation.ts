export const publicRoutes = ['/welcome', '/onboarding'] as const;

export const authenticatedTabs = [
  'home',
  'tournaments',
  'wallet',
  'history',
  'profile',
] as const;

export function createTournamentDetailHref(
  id: string,
): `/tournaments/${string}` {
  return `/tournaments/${encodeURIComponent(id)}`;
}
