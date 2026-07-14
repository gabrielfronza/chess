import { render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthTokenStorage, StoredAuthSession } from './auth-token-storage';
import { useStoredAuthSession } from './use-stored-auth-session';

function Harness({ storage }: { storage: AuthTokenStorage }) {
  const { isAuthenticated, isLoading } = useStoredAuthSession(storage);

  if (isLoading) {
    return <Text>loading</Text>;
  }

  return <Text>{isAuthenticated ? 'authenticated' : 'guest'}</Text>;
}

describe('useStoredAuthSession', () => {
  it('loads valid stored sessions', async () => {
    const storage = createStorage({
      accessToken: 'access-token',
      expiresAt: Date.now() + 60_000,
      idToken: null,
      refreshToken: null,
    });
    const { getByText } = await render(<Harness storage={storage} />);

    await waitFor(() => expect(getByText('authenticated')).toBeTruthy());
  });

  it('treats missing stored sessions as logged out', async () => {
    const storage = createStorage(null);
    const { getByText } = await render(<Harness storage={storage} />);

    await waitFor(() => expect(getByText('guest')).toBeTruthy());
  });

  it('treats storage failures as logged out', async () => {
    const storage = {
      loadValid: jest.fn().mockRejectedValue(new Error('storage failure')),
    } as unknown as AuthTokenStorage;
    const { getByText } = await render(<Harness storage={storage} />);

    await waitFor(() => expect(getByText('guest')).toBeTruthy());
  });
});

function createStorage(session: StoredAuthSession | null): AuthTokenStorage {
  return {
    loadValid: jest.fn().mockResolvedValue(session),
  } as unknown as AuthTokenStorage;
}
