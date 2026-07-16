import { FindOperator, Repository } from 'typeorm';
import { LichessOAuthState } from '../entities';
import { LichessOAuthStateService } from './lichess-oauth-state.service';

describe('LichessOAuthStateService', () => {
  function createService(existingState: LichessOAuthState | null = null) {
    const findOne = jest.fn().mockResolvedValue(existingState);
    const remove = jest.fn().mockResolvedValue(existingState);
    let deletedCriteria: { expiresAt: FindOperator<Date> } | null = null;
    const deleteExpired = jest.fn(
      (criteria: { expiresAt: FindOperator<Date> }) => {
        deletedCriteria = criteria;

        return Promise.resolve({ affected: 0 });
      },
    );
    const transactionalManager = { findOne, remove };
    const manager = {
      ...transactionalManager,
      transaction: jest.fn(
        (operation: (manager: typeof transactionalManager) => unknown) =>
          operation(transactionalManager),
      ),
    };
    const repository = {
      create: jest.fn((state: Partial<LichessOAuthState>) => state),
      delete: deleteExpired,
      manager,
      save: jest.fn((state: LichessOAuthState) => Promise.resolve(state)),
    };

    return {
      getDeletedCriteria: () => deletedCriteria,
      repository,
      service: new LichessOAuthStateService(
        repository as unknown as Repository<LichessOAuthState>,
      ),
    };
  }

  it('creates a hashed state with a PKCE S256 challenge', async () => {
    const { getDeletedCriteria, repository, service } = createService();

    const result = await service.createState({
      now: new Date('2026-01-01T00:00:00.000Z'),
      redirectUri: 'checkmatetour://lichess/callback',
      userId: 'user-id',
    });

    expect(result.state).toHaveLength(43);
    expect(result.codeVerifier.length).toBeGreaterThanOrEqual(43);
    expect(result.codeChallenge).not.toBe(result.codeVerifier);
    expect(result.expiresAt).toEqual(new Date('2026-01-01T00:10:00.000Z'));
    expect(repository.delete).toHaveBeenCalledTimes(1);
    expect(getDeletedCriteria()?.expiresAt).toBeInstanceOf(FindOperator);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        codeVerifier: result.codeVerifier,
        redirectUri: 'checkmatetour://lichess/callback',
        stateHash: service.hashState(result.state),
        userId: 'user-id',
      }),
    );
  });

  it('consumes a valid state once', async () => {
    const existingState = {
      consumedAt: null,
      expiresAt: new Date('2026-01-01T00:10:00.000Z'),
    } as LichessOAuthState;
    const { repository, service } = createService(existingState);

    await expect(
      service.consumeState({
        now: new Date('2026-01-01T00:05:00.000Z'),
        state: 'state',
        userId: 'user-id',
      }),
    ).resolves.toEqual({
      consumedAt: new Date('2026-01-01T00:05:00.000Z'),
      expiresAt: new Date('2026-01-01T00:10:00.000Z'),
    });
    expect(repository.manager.findOne).toHaveBeenCalledWith(LichessOAuthState, {
      lock: { mode: 'pessimistic_write' },
      where: { stateHash: service.hashState('state'), userId: 'user-id' },
    });
    expect(repository.manager.remove).toHaveBeenCalledWith(
      LichessOAuthState,
      existingState,
    );
  });

  it('rejects missing, consumed, or expired states', async () => {
    const { service: missingService } = createService(null);

    await expect(
      missingService.consumeState({ state: 'missing', userId: 'user-id' }),
    ).resolves.toBeNull();

    const { service: consumedService } = createService({
      consumedAt: new Date(),
      expiresAt: new Date(Date.now() + 1000),
    } as LichessOAuthState);

    await expect(
      consumedService.consumeState({ state: 'used', userId: 'user-id' }),
    ).resolves.toBeNull();

    const { service: expiredService } = createService({
      consumedAt: null,
      expiresAt: new Date('2026-01-01T00:00:00.000Z'),
    } as LichessOAuthState);

    await expect(
      expiredService.consumeState({
        now: new Date('2026-01-01T00:00:01.000Z'),
        state: 'expired',
        userId: 'user-id',
      }),
    ).resolves.toBeNull();
  });
});
