import { createMobileConfig } from './config';

describe('createMobileConfig', () => {
  it('reads the public API URL', () => {
    expect(
      createMobileConfig({
        EXPO_PUBLIC_API_URL: 'http://localhost:3000/api/v1',
        EXPO_PUBLIC_AUTH0_AUDIENCE: 'https://api.chess.local',
        EXPO_PUBLIC_AUTH0_CLIENT_ID: 'client-id',
        EXPO_PUBLIC_AUTH0_DOMAIN: 'example.auth0.com',
      }),
    ).toEqual({
      apiBaseUrl: 'http://localhost:3000/api/v1',
      auth0Audience: 'https://api.chess.local',
      auth0ClientId: 'client-id',
      auth0Domain: 'example.auth0.com',
    });
  });

  it('requires the public API URL', () => {
    expect(() => createMobileConfig({})).toThrow(
      'Missing required environment variable: EXPO_PUBLIC_API_URL',
    );
  });

  it('requires Auth0 public settings', () => {
    expect(() =>
      createMobileConfig({
        EXPO_PUBLIC_API_URL: 'http://localhost:3000/api/v1',
      }),
    ).toThrow(
      'Missing required environment variable: EXPO_PUBLIC_AUTH0_AUDIENCE',
    );
  });
});
