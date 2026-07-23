import { ConflictException, Injectable } from '@nestjs/common';
import type { WalletEntryType } from '@checkmatetour/contracts';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UsersService } from '../../users/services';
import { Wallet, WalletEntry } from '../entities';

const MAX_DATABASE_INTEGER = 2_147_483_647;

export type LedgerOperation = {
  amountCents: number;
  idempotencyKey: string;
  reason?: string;
  reference?: string;
  type: WalletEntryType;
};

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly wallets: Repository<Wallet>,
    @InjectRepository(WalletEntry)
    private readonly entries: Repository<WalletEntry>,
    private readonly usersService: UsersService,
  ) {}

  async getBalance(auth0Subject: string): Promise<Wallet> {
    const user = await this.usersService.getAuthenticatedProfile(auth0Subject);
    return this.ensureWallet(user.id);
  }

  async getHistory(auth0Subject: string, page: number, pageSize: number) {
    const user = await this.usersService.getAuthenticatedProfile(auth0Subject);
    const [items, total] = await this.entries.findAndCount({
      order: { createdAt: 'DESC', id: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: { userId: user.id },
    });
    return {
      items,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async adjust(
    actorSubject: string,
    userId: string,
    operation: Omit<LedgerOperation, 'type'>,
  ) {
    const actor = await this.usersService.getAuthenticatedProfile(actorSubject);
    return this.apply(userId, { ...operation, type: 'ADJUSTMENT' }, actor.id);
  }

  apply(userId: string, operation: LedgerOperation, actorUserId?: string) {
    return this.wallets.manager.transaction(async (manager) => {
      const scopedIdempotencyKey = `${userId}:${operation.idempotencyKey}`;
      await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
        scopedIdempotencyKey,
      ]);
      const existing = await manager.findOne(WalletEntry, {
        where: { idempotencyKey: operation.idempotencyKey, userId },
      });
      if (existing) {
        if (!this.matchesExistingOperation(existing, operation)) {
          throw new ConflictException(
            'Idempotency key was already used for a different wallet operation',
          );
        }
        const wallet = await manager.findOneByOrFail(Wallet, {
          id: existing.walletId,
        });
        return { entry: existing, wallet };
      }

      const wallet = await this.lockWallet(manager, userId);
      this.applyBalanceChange(wallet, operation);
      const savedWallet = await manager.save(Wallet, wallet);
      const entry = await manager.save(
        WalletEntry,
        manager.create(WalletEntry, {
          actorUserId: actorUserId ?? null,
          amountCents: operation.amountCents,
          idempotencyKey: operation.idempotencyKey,
          reason: operation.reason ?? null,
          reference: operation.reference ?? null,
          type: operation.type,
          userId,
          walletId: wallet.id,
        }),
      );
      return { entry, wallet: savedWallet };
    });
  }

  private ensureWallet(userId: string): Promise<Wallet> {
    return this.wallets.manager.transaction((manager) =>
      this.lockWallet(manager, userId),
    );
  }

  private async lockWallet(manager: EntityManager, userId: string) {
    await manager.query(
      `INSERT INTO wallets (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
      [userId],
    );
    return manager.findOneOrFail(Wallet, {
      lock: { mode: 'pessimistic_write' },
      where: { userId },
    });
  }

  private applyBalanceChange(wallet: Wallet, operation: LedgerOperation) {
    const amount = operation.amountCents;
    if (!Number.isSafeInteger(amount) || amount === 0) {
      throw new ConflictException('Ledger amount must be a non-zero integer');
    }
    if (Math.abs(amount) > MAX_DATABASE_INTEGER) {
      throw new ConflictException('Ledger amount exceeds the supported range');
    }
    if (operation.type !== 'ADJUSTMENT' && amount < 0) {
      throw new ConflictException('Ledger amount must be positive');
    }

    if (operation.type === 'CREDIT' || operation.type === 'ADJUSTMENT') {
      wallet.availableBalanceCents += amount;
    } else if (operation.type === 'DEBIT') {
      wallet.availableBalanceCents -= Math.abs(amount);
    } else if (operation.type === 'RESERVE') {
      wallet.availableBalanceCents -= Math.abs(amount);
      wallet.reservedBalanceCents += Math.abs(amount);
    } else if (operation.type === 'RELEASE') {
      wallet.reservedBalanceCents -= Math.abs(amount);
      wallet.availableBalanceCents += Math.abs(amount);
    }

    if (wallet.availableBalanceCents < 0 || wallet.reservedBalanceCents < 0) {
      throw new ConflictException('Wallet has insufficient funds');
    }
    if (
      wallet.availableBalanceCents > MAX_DATABASE_INTEGER ||
      wallet.reservedBalanceCents > MAX_DATABASE_INTEGER
    ) {
      throw new ConflictException('Wallet balance exceeds the supported range');
    }
  }

  private matchesExistingOperation(
    existing: WalletEntry,
    operation: LedgerOperation,
  ) {
    return (
      existing.amountCents === operation.amountCents &&
      existing.type === operation.type &&
      existing.reason === (operation.reason ?? null) &&
      existing.reference === (operation.reference ?? null)
    );
  }
}
