import * as SecureStore from 'expo-secure-store';
import { TokenResponse } from 'expo-auth-session';
import { Platform } from 'react-native';

const sessionKey = 'checkmatetour.auth.session';

export type StoredAuthSession = {
  accessToken: string;
  expiresAt: number | null;
  idToken: string | null;
  refreshToken: string | null;
};

type SecureStorage = Pick<
  typeof SecureStore,
  'deleteItemAsync' | 'getItemAsync' | 'setItemAsync'
>;

type BrowserStorage = {
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
};

type BrowserGlobal = typeof globalThis & {
  localStorage?: BrowserStorage;
};

export class WebAuthSessionStorage implements SecureStorage {
  constructor(
    private readonly storage: BrowserStorage | undefined = (
      globalThis as BrowserGlobal
    ).localStorage,
  ) {}

  public async deleteItemAsync(key: string): Promise<void> {
    this.storage?.removeItem(key);
  }

  public async getItemAsync(key: string): Promise<string | null> {
    return this.storage?.getItem(key) ?? null;
  }

  public async setItemAsync(key: string, value: string): Promise<void> {
    this.storage?.setItem(key, value);
  }
}

export function createAuthSessionStorage(): SecureStorage {
  return Platform.OS === 'web' ? new WebAuthSessionStorage() : SecureStore;
}

export class AuthTokenStorage {
  constructor(
    private readonly storage: SecureStorage = createAuthSessionStorage(),
    private readonly sessionStorageKey = sessionKey,
  ) {}

  public toStoredSession(
    tokenResponse: TokenResponse,
    now = Date.now(),
  ): StoredAuthSession {
    return {
      accessToken: tokenResponse.accessToken,
      expiresAt: tokenResponse.expiresIn
        ? now + tokenResponse.expiresIn * 1000
        : null,
      idToken: tokenResponse.idToken ?? null,
      refreshToken: tokenResponse.refreshToken ?? null,
    };
  }

  public async save(session: StoredAuthSession): Promise<void> {
    await this.storage.setItemAsync(
      this.sessionStorageKey,
      JSON.stringify(session),
    );
  }

  public async load(): Promise<StoredAuthSession | null> {
    const value = await this.storage.getItemAsync(this.sessionStorageKey);

    return value ? (JSON.parse(value) as StoredAuthSession) : null;
  }

  public async loadValid(now = Date.now()): Promise<StoredAuthSession | null> {
    const session = await this.load();

    if (this.isExpired(session, now)) {
      await this.clear();

      return null;
    }

    return session;
  }

  public async clear(): Promise<void> {
    await this.storage.deleteItemAsync(this.sessionStorageKey);
  }

  public isExpired(
    session: StoredAuthSession | null,
    now = Date.now(),
  ): boolean {
    return !session?.expiresAt || session.expiresAt <= now;
  }
}
