import { httpClient } from './http-client';
import { walletApi } from './wallet-api';

jest.mock('./http-client', () => ({
  createBearerHeaders: (token: string) => ({
    Authorization: `Bearer ${token}`,
  }),
  httpClient: { get: jest.fn() },
}));

describe('walletApi', () => {
  beforeEach(() => jest.clearAllMocks());

  it('loads balance and paginated history with authentication', async () => {
    (httpClient.get as jest.Mock).mockResolvedValue({});
    await walletApi.getBalance('token');
    await walletApi.getHistory('token', 2, 10);
    expect(httpClient.get).toHaveBeenNthCalledWith(1, '/wallet', {
      headers: { Authorization: 'Bearer token' },
    });
    expect(httpClient.get).toHaveBeenNthCalledWith(
      2,
      '/wallet/entries?page=2&pageSize=10',
      { headers: { Authorization: 'Bearer token' } },
    );
  });
});
