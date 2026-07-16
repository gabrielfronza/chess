import { validateEnvironment } from './environment';

describe('validateEnvironment', () => {
  it('applies safe foundation defaults', () => {
    expect(
      validateEnvironment({
        AUTH0_AUDIENCE: 'https://api.chess.local',
        AUTH0_DOMAIN: 'example.auth0.com',
        DATABASE_URL:
          'postgresql://checkmatetour:checkmatetour_local@localhost:54329/checkmatetour_dev',
      }),
    ).toEqual({
      NODE_ENV: 'development',
      PORT: 3000,
      APP_VERSION: '0.1.0',
      CORS_ALLOWED_ORIGINS:
        'http://localhost:8081,http://localhost:19006,http://127.0.0.1:8081,http://127.0.0.1:19006',
      AUTH0_AUDIENCE: 'https://api.chess.local',
      AUTH0_DOMAIN: 'example.auth0.com',
      DATABASE_URL:
        'postgresql://checkmatetour:checkmatetour_local@localhost:54329/checkmatetour_dev',
      LICHESS_BASE_URL: 'https://lichess.org',
      LICHESS_CLIENT_ID: 'checkmatetour-local',
      LICHESS_REDIRECT_URI: 'checkmatetour://lichess/callback',
      LICHESS_TOKEN_ENCRYPTION_KEY:
        'checkmatetour-local-lichess-token-key-change-me',
    });
  });

  it('rejects an invalid port without exposing unrelated values', () => {
    expect(() =>
      validateEnvironment({ PORT: 'not-a-port', SECRET: 'must-not-leak' }),
    ).toThrow('Invalid environment configuration: PORT:');

    try {
      validateEnvironment({ PORT: 'not-a-port', SECRET: 'must-not-leak' });
    } catch (error) {
      expect((error as Error).message).not.toContain('must-not-leak');
    }
  });

  it('requires explicit database and Auth0 settings in every environment', () => {
    expect(() => validateEnvironment({})).toThrow(
      'Invalid environment configuration: DATABASE_URL:',
    );
  });
});
