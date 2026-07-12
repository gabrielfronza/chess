import {
  authenticatedTabs,
  createTournamentDetailHref,
  publicRoutes,
} from './navigation';

describe('navigation manifest', () => {
  it('keeps public routes separate from authenticated tabs', () => {
    expect(publicRoutes).toEqual(['/welcome', '/onboarding']);
    expect(authenticatedTabs).toEqual([
      'home',
      'tournaments',
      'wallet',
      'history',
      'profile',
    ]);
  });

  it('creates the tournament detail deep-link path', () => {
    expect(createTournamentDetailHref('rapid july')).toBe(
      '/tournaments/rapid%20july',
    );
  });
});
