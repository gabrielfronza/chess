import { useEffect, useMemo, useState } from 'react';
import { AuthTokenStorage, StoredAuthSession } from './auth-token-storage';

export type StoredAuthSessionState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  session: StoredAuthSession | null;
};

export function useStoredAuthSession(
  storage?: AuthTokenStorage,
): StoredAuthSessionState {
  const authTokenStorage = useMemo(
    () => storage ?? new AuthTokenStorage(),
    [storage],
  );
  const [session, setSession] = useState<StoredAuthSession | null>();

  useEffect(() => {
    let isActive = true;

    authTokenStorage
      .loadValid()
      .then((storedSession) => {
        if (isActive) {
          setSession(storedSession);
        }
      })
      .catch(() => {
        if (isActive) {
          setSession(null);
        }
      });

    return () => {
      isActive = false;
    };
  }, [authTokenStorage]);

  return {
    isAuthenticated: Boolean(session),
    isLoading: session === undefined,
    session: session ?? null,
  };
}
