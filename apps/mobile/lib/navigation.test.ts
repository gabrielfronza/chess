import {
  authenticatedRoutes,
  authenticatedTabs,
  createTournamentDetailHref,
  publicRoutes,
} from './navigation';

describe('navigation manifest', () => {
  it('keeps public routes separate from authenticated tabs', () => {
    expect(publicRoutes).toEqual(['/welcome', '/login']);
    expect(authenticatedTabs).toEqual([
      'home',
      'tournaments',
      'wallet',
      'history',
      'profile',
    ]);
    expect(authenticatedRoutes).toEqual(['/onboarding']);
  });

  it('creates the tournament detail deep-link path', () => {
    expect(createTournamentDetailHref('rapid july')).toBe(
      '/tournaments/rapid%20july',
    );
  });
});
