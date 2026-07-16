import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { ProfileContent } from '../app/(app)/profile';
import { type StoredAuthSessionState } from '../lib/auth/use-stored-auth-session';
import {
  type LichessAccountResponse,
  type LichessApi,
} from '../lib/lichess-api';

jest.mock('../components/auth/auth-logout-button', () => ({
  AuthLogoutButton: () => {
    const { Text } = jest.requireActual('react-native');

    return <Text>Sign out</Text>;
  },
}));

const linkedAccount: LichessAccountResponse = {
  id: 'account-id',
  lichessUserId: 'lichess-user-id',
  linkedAt: '2026-01-01T00:00:00.000Z',
  revokedAt: null,
  username: 'PlayerOne',
};

const authenticatedSession: StoredAuthSessionState = {
  isAuthenticated: true,
  isLoading: false,
  session: {
    accessToken: 'access-token',
    expiresAt: Date.now() + 60_000,
    idToken: 'id-token',
    refreshToken: null,
  },
};

function createLichessApi(overrides: Partial<LichessApi> = {}): LichessApi {
  return {
    completeOAuth: jest.fn().mockResolvedValue(linkedAccount),
    getLinkedAccount: jest.fn().mockResolvedValue(linkedAccount),
    revokeLinkedAccount: jest.fn().mockResolvedValue(undefined),
    startOAuth: jest.fn().mockResolvedValue({
      authorizationUrl: 'https://lichess.org/oauth',
      expiresAt: '2026-01-01T00:10:00.000Z',
      state: 'state',
    }),
    ...overrides,
  };
}

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays a linked Lichess account', async () => {
    const lichessApiClient = createLichessApi();
    const { getByText } = await render(
      <ProfileContent
        authSession={authenticatedSession}
        lichessApiClient={lichessApiClient}
      />,
    );

    await waitFor(() =>
      expect(getByText('Connected as PlayerOne')).toBeTruthy(),
    );
    expect(lichessApiClient.getLinkedAccount).toHaveBeenCalledWith(
      'access-token',
    );
  });

  it('connects a Lichess account when none is linked', async () => {
    const lichessApiClient = createLichessApi({
      getLinkedAccount: jest.fn().mockRejectedValue(new Error('not found')),
    });
    const linkAccount = jest.fn().mockResolvedValue(linkedAccount);
    const { getByRole, getByText } = await render(
      <ProfileContent
        authSession={authenticatedSession}
        lichessApiClient={lichessApiClient}
        linkAccount={linkAccount}
      />,
    );

    await waitFor(() =>
      expect(
        getByText(
          'Connect Lichess to prove your chess identity before joining events.',
        ),
      ).toBeTruthy(),
    );
    await fireEvent.press(getByRole('button', { name: 'Connect Lichess' }));

    await waitFor(() =>
      expect(getByText('Connected as PlayerOne')).toBeTruthy(),
    );
    expect(linkAccount).toHaveBeenCalledWith({
      accessToken: 'access-token',
      apiClient: lichessApiClient,
    });
  });

  it('disconnects a linked Lichess account', async () => {
    const lichessApiClient = createLichessApi();
    const { getByRole, getByText } = await render(
      <ProfileContent
        authSession={authenticatedSession}
        lichessApiClient={lichessApiClient}
      />,
    );

    await waitFor(() =>
      expect(getByText('Connected as PlayerOne')).toBeTruthy(),
    );
    await fireEvent.press(getByRole('button', { name: 'Disconnect Lichess' }));

    await waitFor(() =>
      expect(
        getByText(
          'Connect Lichess to prove your chess identity before joining events.',
        ),
      ).toBeTruthy(),
    );
    expect(lichessApiClient.revokeLinkedAccount).toHaveBeenCalledWith(
      'access-token',
    );
  });
});
