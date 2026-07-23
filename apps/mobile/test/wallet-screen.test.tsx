import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { WalletContent } from '../app/(app)/wallet';
import type { StoredAuthSessionState } from '../lib/auth/use-stored-auth-session';
import type { WalletApi } from '../lib/wallet-api';

const session: StoredAuthSessionState = {
  isAuthenticated: true,
  isLoading: false,
  session: {
    accessToken: 'token',
    expiresAt: Date.now() + 60_000,
    idToken: null,
    refreshToken: null,
  },
};

function createApi(overrides: Partial<WalletApi> = {}): WalletApi {
  return {
    getBalance: jest.fn().mockResolvedValue({
      availableBalanceCents: 1250,
      currency: 'USD',
      reservedBalanceCents: 300,
    }),
    getHistory: jest.fn().mockResolvedValue({
      items: [
        {
          amountCents: 1250,
          createdAt: '2026-07-22T12:00:00.000Z',
          id: 'entry-id',
          reason: 'Opening credit',
          reference: 'credit-1',
          type: 'CREDIT',
        },
      ],
      page: 1,
      pageSize: 20,
      total: 1,
      totalPages: 1,
    }),
    ...overrides,
  };
}

describe('WalletContent', () => {
  it('renders balances and traceable history', async () => {
    const screen = await render(
      <WalletContent authSession={session} walletApiClient={createApi()} />,
    );
    await waitFor(() => expect(screen.getByText('$12.50')).toBeTruthy());
    expect(screen.getByText('Reserved $3.00')).toBeTruthy();
    expect(screen.getByText('CREDIT · $12.50')).toBeTruthy();
    expect(screen.getByText('credit-1')).toBeTruthy();
  });

  it('retries a failed wallet request', async () => {
    const api = createApi({
      getBalance: jest
        .fn()
        .mockRejectedValueOnce(new Error('Network unavailable'))
        .mockResolvedValue({
          availableBalanceCents: 0,
          currency: 'USD',
          reservedBalanceCents: 0,
        }),
    });
    const screen = await render(
      <WalletContent authSession={session} walletApiClient={api} />,
    );
    await waitFor(() =>
      expect(screen.getByText('Network unavailable')).toBeTruthy(),
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    await waitFor(() => expect(screen.getByText('$0.00')).toBeTruthy());
  });
});
