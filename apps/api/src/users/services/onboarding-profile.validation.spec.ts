import { BadRequestException } from '@nestjs/common';
import { validateUpdateOnboardingProfile } from './onboarding-profile.validation';

describe('validateUpdateOnboardingProfile', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-13T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('normalizes and returns valid onboarding profile input', () => {
    expect(
      validateUpdateOnboardingProfile({
        country: 'br',
        dateOfBirth: '1990-01-02',
        displayName: ' Player One ',
      }),
    ).toEqual({
      country: 'BR',
      dateOfBirth: '1990-01-02',
      displayName: 'Player One',
    });
  });

  it('rejects invalid profile input with safe validation messages', () => {
    expect(() =>
      validateUpdateOnboardingProfile({
        country: 'BRA',
        dateOfBirth: '2020-99-99',
        displayName: 'A',
      }),
    ).toThrow(BadRequestException);
  });

  it('requires users to satisfy the minimum age policy', () => {
    expect(() =>
      validateUpdateOnboardingProfile({
        country: 'US',
        dateOfBirth: '2010-07-14',
        displayName: 'Young Player',
      }),
    ).toThrow(BadRequestException);
  });
});
