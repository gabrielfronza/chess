import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/services';
import { Wallet, WalletEntry } from '../entities';
import { WalletService } from './wallet.service';

describe('WalletService', () => {
  function setup(existingEntry: WalletEntry | null = null) {
    const wallet = {
      availableBalanceCents: 1000,
      id: 'wallet-id',
      reservedBalanceCents: 0,
      userId: 'user-id',
    } as Wallet;
    const transactionalManager = {
      create: jest.fn((_type: unknown, value: object) => value),
      findOne: jest.fn().mockResolvedValue(existingEntry),
      findOneByOrFail: jest.fn().mockResolvedValue(wallet),
      findOneOrFail: jest.fn().mockResolvedValue(wallet),
      query: jest.fn().mockResolvedValue(undefined),
      save: jest.fn((_type, value) => Promise.resolve(value)),
    };
    const wallets = {
      manager: {
        transaction: jest.fn(
          (operation: (manager: typeof transactionalManager) => unknown) =>
            operation(transactionalManager),
        ),
      },
    };
    const entries = { findAndCount: jest.fn().mockResolvedValue([[], 0]) };
    const users = {
      getAuthenticatedProfile: jest.fn().mockResolvedValue({ id: 'actor-id' }),
    };
    return {
      entries,
      manager: transactionalManager,
      service: new WalletService(
        wallets as unknown as Repository<Wallet>,
        entries as unknown as Repository<WalletEntry>,
        users as unknown as UsersService,
      ),
      users,
      wallet,
    };
  }

  it('loads or creates the authenticated user wallet', async () => {
    const { manager, service, wallet } = setup();

    await expect(service.getBalance('auth0|user')).resolves.toBe(wallet);
    expect(manager.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO wallets'),
      ['actor-id'],
    );
  });

  it('returns paginated ledger history for the authenticated user', async () => {
    const { entries, service } = setup();
    const history = [{ id: 'entry-id' }] as WalletEntry[];
    entries.findAndCount.mockResolvedValue([history, 21]);

    await expect(service.getHistory('auth0|user', 2, 10)).resolves.toEqual({
      items: history,
      page: 2,
      pageSize: 10,
      total: 21,
      totalPages: 3,
    });
    expect(entries.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 10 }),
    );
  });

  it('posts a signed admin adjustment with its actor', async () => {
    const { manager, service, wallet } = setup();

    await service.adjust('auth0|admin', 'user-id', {
      amountCents: 250,
      idempotencyKey: 'adjust-1',
      reason: 'Manual correction',
    });

    expect(wallet.availableBalanceCents).toBe(1250);
    expect(manager.create).toHaveBeenCalledWith(
      WalletEntry,
      expect.objectContaining({ actorUserId: 'actor-id', type: 'ADJUSTMENT' }),
    );
  });

  it('serializes idempotency and locks balances before posting', async () => {
    const { manager, service, wallet } = setup();
    await expect(
      service.apply('user-id', {
        amountCents: 400,
        idempotencyKey: 'reserve-1',
        type: 'RESERVE',
      }),
    ).resolves.toMatchObject({ wallet });
    expect(wallet).toMatchObject({
      availableBalanceCents: 600,
      reservedBalanceCents: 400,
    });
    expect(manager.query).toHaveBeenNthCalledWith(
      1,
      'SELECT pg_advisory_xact_lock(hashtext($1))',
      ['user-id:reserve-1'],
    );
    expect(manager.findOneOrFail).toHaveBeenCalledWith(
      Wallet,
      expect.objectContaining({ lock: { mode: 'pessimistic_write' } }),
    );
  });

  it('returns the existing entry for a repeated idempotency key', async () => {
    const existing = {
      amountCents: 400,
      id: 'entry-id',
      reason: null,
      reference: null,
      type: 'RESERVE',
      walletId: 'wallet-id',
    } as WalletEntry;
    const { manager, service } = setup(existing);
    await expect(
      service.apply('user-id', {
        amountCents: 400,
        idempotencyKey: 'reserve-1',
        type: 'RESERVE',
      }),
    ).resolves.toMatchObject({ entry: existing });
    expect(manager.save).not.toHaveBeenCalled();
  });

  it('rejects reuse of an idempotency key with a different payload', async () => {
    const existing = {
      amountCents: 400,
      id: 'entry-id',
      reason: null,
      reference: null,
      type: 'RESERVE',
      walletId: 'wallet-id',
    } as WalletEntry;
    const { service } = setup(existing);

    await expect(
      service.apply('user-id', {
        amountCents: 300,
        idempotencyKey: 'reserve-1',
        type: 'RESERVE',
      }),
    ).rejects.toThrow('Idempotency key was already used');
  });

  it.each([
    ['CREDIT', 200, 1200, 0],
    ['DEBIT', 200, 800, 0],
    ['RELEASE', 200, 1200, 200],
  ] as const)(
    'applies a %s operation',
    async (type, amountCents, availableBalanceCents, reservedBalanceCents) => {
      const { service, wallet } = setup();
      wallet.reservedBalanceCents = type === 'RELEASE' ? 400 : 0;

      await service.apply('user-id', {
        amountCents,
        idempotencyKey: `${type.toLowerCase()}-1`,
        type,
      });

      expect(wallet).toMatchObject({
        availableBalanceCents,
        reservedBalanceCents,
      });
    },
  );

  it('rejects invalid amounts and unsafe resulting balances', async () => {
    const first = setup();
    await expect(
      first.service.apply('user-id', {
        amountCents: -1,
        idempotencyKey: 'credit-negative',
        type: 'CREDIT',
      }),
    ).rejects.toThrow('Ledger amount must be positive');

    const second = setup();
    await expect(
      second.service.apply('user-id', {
        amountCents: 0,
        idempotencyKey: 'credit-zero',
        type: 'CREDIT',
      }),
    ).rejects.toThrow('Ledger amount must be a non-zero integer');

    const third = setup();
    third.wallet.availableBalanceCents = 2_147_483_647;
    await expect(
      third.service.apply('user-id', {
        amountCents: 1,
        idempotencyKey: 'credit-overflow',
        type: 'CREDIT',
      }),
    ).rejects.toThrow('Wallet balance exceeds the supported range');
  });

  it('rejects operations that would make a balance negative', async () => {
    const { service } = setup();
    await expect(
      service.apply('user-id', {
        amountCents: 1500,
        idempotencyKey: 'debit-1',
        type: 'DEBIT',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
