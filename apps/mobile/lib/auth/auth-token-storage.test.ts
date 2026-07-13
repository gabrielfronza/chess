import { TokenResponse } from 'expo-auth-session';
import { AuthTokenStorage, WebAuthSessionStorage } from './auth-token-storage';

describe('auth-token-storage', () => {
  it('converts token responses to safe stored sessions', () => {
    const authTokenStorage = new AuthTokenStorage();

    expect(
      authTokenStorage.toStoredSession(
        {
          accessToken: 'access-token',
          expiresIn: 60,
          idToken: 'id-token',
          refreshToken: 'refresh-token',
        } as TokenResponse,
        1000,
      ),
    ).toEqual({
      accessToken: 'access-token',
      expiresAt: 61_000,
      idToken: 'id-token',
      refreshToken: 'refresh-token',
    });
  });

  it('saves, loads, and clears sessions without exposing token values', async () => {
    const storage = {
      deleteItemAsync: jest.fn().mockResolvedValue(undefined),
      getItemAsync: jest.fn().mockResolvedValue(
        JSON.stringify({
          accessToken: 'access-token',
          expiresAt: null,
          idToken: null,
          refreshToken: null,
        }),
      ),
      setItemAsync: jest.fn().mockResolvedValue(undefined),
    };
    const authTokenStorage = new AuthTokenStorage(storage);

    await authTokenStorage.save({
      accessToken: 'access-token',
      expiresAt: null,
      idToken: null,
      refreshToken: null,
    });
    await expect(authTokenStorage.load()).resolves.toEqual({
      accessToken: 'access-token',
      expiresAt: null,
      idToken: null,
      refreshToken: null,
    });
    await authTokenStorage.clear();

    expect(storage.setItemAsync).toHaveBeenCalledWith(
      'checkmatetour.auth.session',
      expect.any(String),
    );
    expect(storage.deleteItemAsync).toHaveBeenCalledWith(
      'checkmatetour.auth.session',
    );
  });

  it('detects missing and expired sessions', () => {
    const authTokenStorage = new AuthTokenStorage();

    expect(authTokenStorage.isExpired(null)).toBe(true);
    expect(
      authTokenStorage.isExpired(
        {
          accessToken: 'access-token',
          expiresAt: 1000,
          idToken: null,
          refreshToken: null,
        },
        1000,
      ),
    ).toBe(true);
    expect(
      authTokenStorage.isExpired(
        {
          accessToken: 'access-token',
          expiresAt: 1001,
          idToken: null,
          refreshToken: null,
        },
        1000,
      ),
    ).toBe(false);
  });

  it('clears expired stored sessions before returning them to callers', async () => {
    const storage = {
      deleteItemAsync: jest.fn().mockResolvedValue(undefined),
      getItemAsync: jest.fn().mockResolvedValue(
        JSON.stringify({
          accessToken: 'expired-token',
          expiresAt: 1000,
          idToken: null,
          refreshToken: null,
        }),
      ),
      setItemAsync: jest.fn(),
    };
    const authTokenStorage = new AuthTokenStorage(storage);

    await expect(authTokenStorage.loadValid(1000)).resolves.toBeNull();

    expect(storage.deleteItemAsync).toHaveBeenCalledWith(
      'checkmatetour.auth.session',
    );
  });

  it('returns non-expired stored sessions', async () => {
    const session = {
      accessToken: 'access-token',
      expiresAt: 1001,
      idToken: null,
      refreshToken: null,
    };
    const storage = {
      deleteItemAsync: jest.fn(),
      getItemAsync: jest.fn().mockResolvedValue(JSON.stringify(session)),
      setItemAsync: jest.fn(),
    };
    const authTokenStorage = new AuthTokenStorage(storage);

    await expect(authTokenStorage.loadValid(1000)).resolves.toEqual(session);

    expect(storage.deleteItemAsync).not.toHaveBeenCalled();
  });

  it('stores web sessions through browser storage when SecureStore is unavailable', async () => {
    const browserStorage = {
      getItem: jest.fn().mockReturnValue('stored-session'),
      removeItem: jest.fn(),
      setItem: jest.fn(),
    };
    const storage = new WebAuthSessionStorage(browserStorage);

    await storage.setItemAsync('session-key', 'session-value');
    await expect(storage.getItemAsync('session-key')).resolves.toBe(
      'stored-session',
    );
    await storage.deleteItemAsync('session-key');

    expect(browserStorage.setItem).toHaveBeenCalledWith(
      'session-key',
      'session-value',
    );
    expect(browserStorage.getItem).toHaveBeenCalledWith('session-key');
    expect(browserStorage.removeItem).toHaveBeenCalledWith('session-key');
  });
});
