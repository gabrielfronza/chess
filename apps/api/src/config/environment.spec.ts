import { validateEnvironment } from './environment';

describe('validateEnvironment', () => {
  it('applies safe foundation defaults', () => {
    expect(
      validateEnvironment({
        DATABASE_URL:
          'postgresql://chess_app:chess_app_local@localhost:54329/chess_app_dev',
      }),
    ).toEqual({
      NODE_ENV: 'development',
      PORT: 3000,
      APP_VERSION: '0.1.0',
      DATABASE_URL:
        'postgresql://chess_app:chess_app_local@localhost:54329/chess_app_dev',
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

  it('requires an explicit database URL in every environment', () => {
    expect(() => validateEnvironment({})).toThrow(
      'Invalid environment configuration: DATABASE_URL:',
    );
  });
});
