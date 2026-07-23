import { Wallet, WalletEntry } from '../entities';
import { WalletResponseMapper } from '../mappers';
import { WalletService } from '../services';
import { WalletController } from './wallet.controller';

describe('WalletController', () => {
  const wallet = {
    availableBalanceCents: 1000,
    reservedBalanceCents: 200,
  } as Wallet;
  const entry = {
    amountCents: 1000,
    createdAt: new Date('2026-07-22T12:00:00.000Z'),
    id: 'entry-id',
    reason: 'Correction',
    reference: null,
    type: 'ADJUSTMENT',
  } as WalletEntry;
  const service = {
    getBalance: jest.fn().mockResolvedValue(wallet),
    getHistory: jest.fn().mockResolvedValue({
      items: [entry],
      page: 1,
      pageSize: 20,
      total: 1,
      totalPages: 1,
    }),
  } as unknown as jest.Mocked<WalletService>;
  const mapper = new WalletResponseMapper();

  it('returns the current user balance and history', async () => {
    const controller = new WalletController(mapper, service);
    const user = { sub: 'auth0|user' } as never;
    await expect(controller.getBalance(user)).resolves.toMatchObject({
      availableBalanceCents: 1000,
    });
    await expect(controller.getHistory(user, {})).resolves.toMatchObject({
      items: [expect.objectContaining({ id: 'entry-id' })],
    });
  });
});
