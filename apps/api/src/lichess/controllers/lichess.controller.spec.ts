import { LichessAccount } from '../entities';
import { LichessAccountResponseMapper } from '../mappers';
import { LichessService } from '../services';
import { LichessController } from './lichess.controller';

describe('LichessController', () => {
  const authenticatedUser = {
    email: 'player@example.com',
    sub: 'auth0|123',
  };

  it('starts Lichess OAuth for the authenticated user', async () => {
    const startOAuth = jest.fn().mockResolvedValue({
      authorizationUrl: 'https://lichess.dev/oauth',
      expiresAt: '2026-01-01T00:10:00.000Z',
      state: 'state',
    });
    const controller = createController({ startOAuth });

    await expect(controller.startOAuth(authenticatedUser)).resolves.toEqual({
      authorizationUrl: 'https://lichess.dev/oauth',
      expiresAt: '2026-01-01T00:10:00.000Z',
      state: 'state',
    });
    expect(startOAuth).toHaveBeenCalledWith('auth0|123');
  });

  it('validates callback payload and returns the linked Lichess account', async () => {
    const completeOAuth = jest.fn().mockResolvedValue(createAccount());
    const controller = createController({ completeOAuth });

    await expect(
      controller.completeOAuth(authenticatedUser, {
        code: ' code ',
        state: ' state ',
      }),
    ).resolves.toEqual({
      id: 'account-id',
      linkedAt: '2026-01-01T00:00:00.000Z',
      lichessUserId: 'lichess-user-id',
      revokedAt: null,
      username: 'PlayerOne',
    });
    expect(completeOAuth).toHaveBeenCalledWith({
      auth0Subject: 'auth0|123',
      code: 'code',
      state: 'state',
    });
  });

  it('revokes the authenticated user Lichess link', async () => {
    const revokeLinkedAccount = jest.fn().mockResolvedValue(undefined);
    const controller = createController({ revokeLinkedAccount });

    await expect(
      controller.revokeLinkedAccount(authenticatedUser),
    ).resolves.toBeUndefined();
    expect(revokeLinkedAccount).toHaveBeenCalledWith('auth0|123');
  });

  it('returns the authenticated user linked Lichess account', async () => {
    const getLinkedAccount = jest.fn().mockResolvedValue(createAccount());
    const controller = createController({ getLinkedAccount });

    await expect(
      controller.getLinkedAccount(authenticatedUser),
    ).resolves.toEqual({
      id: 'account-id',
      linkedAt: '2026-01-01T00:00:00.000Z',
      lichessUserId: 'lichess-user-id',
      revokedAt: null,
      username: 'PlayerOne',
    });
    expect(getLinkedAccount).toHaveBeenCalledWith('auth0|123');
  });
});

function createController(service: Partial<LichessService>): LichessController {
  return new LichessController(
    new LichessAccountResponseMapper(),
    service as LichessService,
  );
}

function createAccount(): LichessAccount {
  return {
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    id: 'account-id',
    lichessUserId: 'lichess-user-id',
    revokedAt: null,
    username: 'PlayerOne',
  } as LichessAccount;
}
