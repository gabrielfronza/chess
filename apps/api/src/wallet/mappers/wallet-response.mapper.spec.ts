import { Wallet, WalletEntry } from '../entities';
import { WalletResponseMapper } from './wallet-response.mapper';

describe('WalletResponseMapper', () => {
  const mapper = new WalletResponseMapper();

  it('maps balances and ledger entries', () => {
    expect(
      mapper.toBalance({
        availableBalanceCents: 1200,
        reservedBalanceCents: 300,
      } as Wallet),
    ).toEqual({
      availableBalanceCents: 1200,
      currency: 'USD',
      reservedBalanceCents: 300,
    });
    expect(
      mapper.toEntry({
        amountCents: 500,
        createdAt: new Date('2026-07-22T12:00:00.000Z'),
        id: 'entry-id',
        reason: 'Correction',
        reference: 'ticket-1',
        type: 'ADJUSTMENT',
      } as WalletEntry),
    ).toEqual(
      expect.objectContaining({
        createdAt: '2026-07-22T12:00:00.000Z',
        id: 'entry-id',
      }),
    );
  });
});
