import {
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, QueryFailedError, Repository } from 'typeorm';
import { Environment } from '../../config/environment';
import { UsersService } from '../../users/services';
import { LichessAccount } from '../entities';
import { LichessApiClient } from './lichess-api.client';
import { LichessOAuthStateService } from './lichess-oauth-state.service';
import { SecretCipherService } from './secret-cipher.service';

@Injectable()
export class LichessService {
  constructor(
    @InjectRepository(LichessAccount)
    private readonly lichessAccountsRepository: Repository<LichessAccount>,
    private readonly configService: ConfigService<Environment, true>,
    private readonly lichessApiClient: LichessApiClient,
    private readonly oauthStateService: LichessOAuthStateService,
    private readonly secretCipherService: SecretCipherService,
    private readonly usersService: UsersService,
  ) {}

  async startOAuth(auth0Subject: string): Promise<{
    authorizationUrl: string;
    expiresAt: string;
    state: string;
  }> {
    const user = await this.usersService.getAuthenticatedProfile(auth0Subject);
    const redirectUri = this.configService.get('LICHESS_REDIRECT_URI', {
      infer: true,
    });
    const oauthState = await this.oauthStateService.createState({
      redirectUri,
      userId: user.id,
    });

    return {
      authorizationUrl: this.lichessApiClient.buildAuthorizationUrl({
        codeChallenge: oauthState.codeChallenge,
        redirectUri,
        state: oauthState.state,
      }),
      expiresAt: oauthState.expiresAt.toISOString(),
      state: oauthState.state,
    };
  }

  async completeOAuth({
    auth0Subject,
    code,
    state,
  }: {
    auth0Subject: string;
    code: string;
    state: string;
  }): Promise<LichessAccount> {
    const user = await this.usersService.getAuthenticatedProfile(auth0Subject);
    const oauthState = await this.oauthStateService.consumeState({
      state,
      userId: user.id,
    });

    if (!oauthState) {
      throw new UnauthorizedException('Invalid or expired Lichess OAuth state');
    }

    const tokenResponse = await this.exchangeAuthorizationCode({
      code,
      codeVerifier: oauthState.codeVerifier,
      redirectUri: oauthState.redirectUri,
    });
    const lichessProfile = await this.getAccount(tokenResponse.access_token);
    const encryptedToken = this.secretCipherService.encrypt(
      tokenResponse.access_token,
    );

    const existingAccount = await this.lichessAccountsRepository.findOne({
      where: { revokedAt: IsNull(), userId: user.id },
    });
    const account =
      existingAccount ??
      this.lichessAccountsRepository.create({
        user,
        userId: user.id,
      });

    account.accessTokenAuthTag = encryptedToken.authTag;
    account.accessTokenCiphertext = encryptedToken.ciphertext;
    account.accessTokenIv = encryptedToken.iv;
    account.lichessUserId = lichessProfile.id;
    account.revokedAt = null;
    account.scopes = tokenResponse.scope?.split(' ').filter(Boolean) ?? [];
    account.tokenExpiresAt = new Date(
      Date.now() + tokenResponse.expires_in * 1000,
    );
    account.username = lichessProfile.username;

    try {
      return await this.lichessAccountsRepository.save(account);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException(
          'This Lichess account is already linked to another user',
        );
      }

      throw error;
    }
  }

  async getLinkedAccount(auth0Subject: string): Promise<LichessAccount> {
    const user = await this.usersService.getAuthenticatedProfile(auth0Subject);
    const account = await this.lichessAccountsRepository.findOne({
      where: { revokedAt: IsNull(), userId: user.id },
    });

    if (!account) {
      throw new NotFoundException('No active Lichess account is linked');
    }

    return account;
  }

  async revokeLinkedAccount(auth0Subject: string): Promise<void> {
    const account = await this.getLinkedAccount(auth0Subject);
    const accessToken = this.secretCipherService.decrypt({
      authTag: account.accessTokenAuthTag,
      ciphertext: account.accessTokenCiphertext,
      iv: account.accessTokenIv,
    });

    await this.revokeAccessToken(accessToken);
    account.revokedAt = new Date();
    await this.lichessAccountsRepository.save(account);
  }

  private async exchangeAuthorizationCode(options: {
    code: string;
    codeVerifier: string;
    redirectUri: string;
  }) {
    try {
      return await this.lichessApiClient.exchangeAuthorizationCode(options);
    } catch {
      throw new ServiceUnavailableException(
        'Lichess is unavailable. Please try again.',
      );
    }
  }

  private async getAccount(accessToken: string) {
    try {
      return await this.lichessApiClient.getAccount(accessToken);
    } catch {
      throw new ServiceUnavailableException(
        'Lichess is unavailable. Please try again.',
      );
    }
  }

  private async revokeAccessToken(accessToken: string): Promise<void> {
    try {
      await this.lichessApiClient.revokeAccessToken(accessToken);
    } catch {
      throw new ServiceUnavailableException(
        'Lichess is unavailable. Please try again.',
      );
    }
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error.driverError as { code?: string }).code === '23505'
    );
  }
}
