import { createMobileConfig } from './config';

describe('createMobileConfig', () => {
  it('reads the public API URL', () => {
    expect(
      createMobileConfig({
        EXPO_PUBLIC_API_URL: 'http://localhost:3000/api/v1',
      }),
    ).toEqual({
      apiBaseUrl: 'http://localhost:3000/api/v1',
    });
  });

  it('requires the public API URL', () => {
    expect(() => createMobileConfig({})).toThrow(
      'Missing required environment variable: EXPO_PUBLIC_API_URL',
    );
  });
});
