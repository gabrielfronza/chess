import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { UsersService } from '../../users/services';
import { LichessAccount } from '../entities';
import { LichessApiClient } from './lichess-api.client';
import { LichessOAuthStateService } from './lichess-oauth-state.service';
import { LichessService } from './lichess.service';
import { SecretCipherService } from './secret-cipher.service';

describe('LichessService', () => {
  function createService({
    existingAccount = null,
    getAccount = jest.fn().mockResolvedValue({
      id: 'lichess-user-id',
      username: 'PlayerOne',
    }),
    revokeAccessToken = jest.fn().mockResolvedValue(undefined),
    save = jest.fn((account: LichessAccount) => Promise.resolve(account)),
    state = {
      codeVerifier: 'verifier',
      redirectUri: 'checkmatetour://lichess/callback',
    },
    exchangeAuthorizationCode = jest.fn().mockResolvedValue({
      access_token: 'lichess-token',
      expires_in: 31536000,
      scope: 'challenge:write',
      token_type: 'Bearer',
    }),
  }: {
    exchangeAuthorizationCode?: jest.Mock;
    existingAccount?: LichessAccount | null;
    getAccount?: jest.Mock;
    revokeAccessToken?: jest.Mock;
    save?: jest.Mock;
    state?: { codeVerifier: string; redirectUri: string } | null;
  } = {}) {
    const repository = {
      create: jest.fn((account: Partial<LichessAccount>) => account),
      findOne: jest.fn(
        (options: { where?: { revokedAt?: unknown; userId?: string } }) =>
          Promise.resolve(
            existingAccount?.revokedAt && options.where?.revokedAt
              ? null
              : existingAccount,
          ),
      ),
      save,
    };
    const configService = {
      get: jest.fn((key: string) => {
        const values: Record<string, string> = {
          LICHESS_REDIRECT_URI: 'checkmatetour://lichess/callback',
        };

        return values[key];
      }),
    };
    const lichessApiClient = {
      buildAuthorizationUrl: jest.fn(() => 'https://lichess.dev/oauth'),
      exchangeAuthorizationCode,
      getAccount,
      revokeAccessToken,
    };
    const oauthStateService = {
      consumeState: jest.fn().mockResolvedValue(state),
      createState: jest.fn().mockResolvedValue({
        codeChallenge: 'challenge',
        expiresAt: new Date('2026-01-01T00:10:00.000Z'),
        state: 'state',
      }),
    };
    const secretCipherService = {
      decrypt: jest.fn(() => 'lichess-token'),
      encrypt: jest.fn(() => ({
        authTag: 'tag',
        ciphertext: 'ciphertext',
        iv: 'iv',
      })),
    };
    const usersService = {
      getAuthenticatedProfile: jest.fn().mockResolvedValue({
        id: 'user-id',
      }),
    };

    return {
      lichessApiClient,
      oauthStateService,
      repository,
      secretCipherService,
      service: new LichessService(
        repository as unknown as Repository<LichessAccount>,
        configService as unknown as ConfigService,
        lichessApiClient as unknown as LichessApiClient,
        oauthStateService as unknown as LichessOAuthStateService,
        secretCipherService as unknown as SecretCipherService,
        usersService as unknown as UsersService,
      ),
      usersService,
    };
  }

  it('starts OAuth with a stored state and authorization URL', async () => {
    const { lichessApiClient, oauthStateService, service } = createService();

    await expect(service.startOAuth('auth0|abc')).resolves.toEqual({
      authorizationUrl: 'https://lichess.dev/oauth',
      expiresAt: '2026-01-01T00:10:00.000Z',
      state: 'state',
    });
    expect(oauthStateService.createState).toHaveBeenCalledWith({
      redirectUri: 'checkmatetour://lichess/callback',
      userId: 'user-id',
    });
    expect(lichessApiClient.buildAuthorizationUrl).toHaveBeenCalledWith({
      codeChallenge: 'challenge',
      redirectUri: 'checkmatetour://lichess/callback',
      state: 'state',
    });
  });

  it('completes OAuth by exchanging the code and linking the Lichess identity', async () => {
    const { lichessApiClient, repository, secretCipherService, service } =
      createService();

    await expect(
      service.completeOAuth({
        auth0Subject: 'auth0|abc',
        code: 'code',
        state: 'state',
      }),
    ).resolves.toMatchObject({
      accessTokenAuthTag: 'tag',
      accessTokenCiphertext: 'ciphertext',
      accessTokenIv: 'iv',
      lichessUserId: 'lichess-user-id',
      scopes: ['challenge:write'],
      username: 'PlayerOne',
    });
    expect(lichessApiClient.exchangeAuthorizationCode).toHaveBeenCalledWith({
      code: 'code',
      codeVerifier: 'verifier',
      redirectUri: 'checkmatetour://lichess/callback',
    });
    expect(lichessApiClient.getAccount).toHaveBeenCalledWith('lichess-token');
    expect(secretCipherService.encrypt).toHaveBeenCalledWith('lichess-token');
    expect(repository.findOne).toHaveBeenCalledTimes(1);
    expect(repository.findOne.mock.calls[0][0].where?.userId).toBe('user-id');
    expect(repository.findOne.mock.calls[0][0].where?.revokedAt).toBeDefined();
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        lichessUserId: 'lichess-user-id',
        userId: 'user-id',
      }),
    );
  });

  it('creates a new link instead of overwriting revoked link history', async () => {
    const revokedAccount = {
      id: 'revoked-account-id',
      revokedAt: new Date('2026-01-01T00:00:00.000Z'),
      userId: 'user-id',
    } as LichessAccount;
    const { repository, service } = createService({
      existingAccount: revokedAccount,
    });

    await service.completeOAuth({
      auth0Subject: 'auth0|abc',
      code: 'code',
      state: 'state',
    });

    expect(repository.findOne.mock.calls[0][0].where?.userId).toBe('user-id');
    expect(repository.findOne.mock.calls[0][0].where?.revokedAt).toBeDefined();
    const createdAccount = repository.create.mock.calls[0][0];
    expect(createdAccount.user?.id).toBe('user-id');
    expect(createdAccount.userId).toBe('user-id');
  });

  it('rejects invalid or expired OAuth state', async () => {
    const { service } = createService({ state: null });

    await expect(
      service.completeOAuth({
        auth0Subject: 'auth0|abc',
        code: 'code',
        state: 'expired',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('maps duplicate Lichess links to a conflict', async () => {
    const save = jest.fn().mockRejectedValue(
      new QueryFailedError('INSERT', [], {
        code: '23505',
      }),
    );
    const { service } = createService({ save });

    await expect(
      service.completeOAuth({
        auth0Subject: 'auth0|abc',
        code: 'code',
        state: 'state',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns a recoverable error when Lichess token exchange fails', async () => {
    const { service } = createService({
      exchangeAuthorizationCode: jest
        .fn()
        .mockRejectedValue(new Error('network failure')),
    });

    await expect(
      service.completeOAuth({
        auth0Subject: 'auth0|abc',
        code: 'code',
        state: 'state',
      }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('returns a recoverable error when Lichess profile lookup fails', async () => {
    const { service } = createService({
      getAccount: jest.fn().mockRejectedValue(new Error('timeout')),
    });

    await expect(
      service.completeOAuth({
        auth0Subject: 'auth0|abc',
        code: 'code',
        state: 'state',
      }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('revokes the linked account token without exposing plaintext', async () => {
    const existingAccount = {
      accessTokenAuthTag: 'tag',
      accessTokenCiphertext: 'ciphertext',
      accessTokenIv: 'iv',
      revokedAt: null,
      userId: 'user-id',
    } as LichessAccount;
    const { lichessApiClient, repository, secretCipherService, service } =
      createService({ existingAccount });

    await service.revokeLinkedAccount('auth0|abc');

    expect(secretCipherService.decrypt).toHaveBeenCalledWith({
      authTag: 'tag',
      ciphertext: 'ciphertext',
      iv: 'iv',
    });
    expect(lichessApiClient.revokeAccessToken).toHaveBeenCalledWith(
      'lichess-token',
    );
    expect(existingAccount.revokedAt).toBeInstanceOf(Date);
    expect(repository.save).toHaveBeenCalledWith(existingAccount);
  });

  it('returns a recoverable error when Lichess token revocation fails', async () => {
    const existingAccount = {
      accessTokenAuthTag: 'tag',
      accessTokenCiphertext: 'ciphertext',
      accessTokenIv: 'iv',
      revokedAt: null,
      userId: 'user-id',
    } as LichessAccount;
    const { service } = createService({
      existingAccount,
      revokeAccessToken: jest.fn().mockRejectedValue(new Error('timeout')),
    });

    await expect(
      service.revokeLinkedAccount('auth0|abc'),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('rejects linked account lookup when none exists', async () => {
    const { service } = createService();

    await expect(service.getLinkedAccount('auth0|abc')).rejects.toThrow(
      'No active Lichess account is linked',
    );
  });
});
