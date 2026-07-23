import { Wallet, WalletEntry } from '../entities';
import { WalletResponseMapper } from '../mappers';
import { WalletService } from '../services';
import { AdminWalletController } from './admin-wallet.controller';

describe('AdminWalletController', () => {
  const wallet = {
    availableBalanceCents: 1000,
    reservedBalanceCents: 200,
  } as Wallet;
  const entry = {
    amountCents: 1000,
    createdAt: new Date('2026-07-22T12:00:00.000Z'),
    id: 'entry-id',
    reason: 'Correction',
    reference: 'support-ticket-123',
    type: 'ADJUSTMENT',
  } as WalletEntry;
  const adjust = jest.fn().mockResolvedValue({ entry, wallet });
  const service = { adjust } as unknown as jest.Mocked<WalletService>;
  const controller = new AdminWalletController(
    new WalletResponseMapper(),
    service,
  );

  beforeEach(() => jest.clearAllMocks());

  it('validates and posts an audited administrative adjustment', async () => {
    const input = {
      amountCents: 1000,
      idempotencyKey: 'adjust-001',
      reason: 'Correction',
      reference: 'support-ticket-123',
    };

    await expect(
      controller.adjust({ sub: 'auth0|admin' }, 'user-id', input),
    ).resolves.toEqual({
      balance: {
        availableBalanceCents: 1000,
        currency: 'USD',
        reservedBalanceCents: 200,
      },
      entry: {
        amountCents: 1000,
        createdAt: '2026-07-22T12:00:00.000Z',
        id: 'entry-id',
        reason: 'Correction',
        reference: 'support-ticket-123',
        type: 'ADJUSTMENT',
      },
    });
    expect(adjust).toHaveBeenCalledWith('auth0|admin', 'user-id', input);
  });

  it('rejects an invalid adjustment before calling the service', async () => {
    await expect(
      controller.adjust({ sub: 'auth0|admin' }, 'user-id', {
        amountCents: 0,
        idempotencyKey: 'short',
        reason: '',
      }),
    ).rejects.toMatchObject({ status: 400 });
    expect(adjust).not.toHaveBeenCalled();
  });
});
