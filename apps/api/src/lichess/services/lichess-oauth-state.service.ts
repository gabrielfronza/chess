import { createHash, randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LichessOAuthState } from '../entities';

const stateTtlMs = 10 * 60 * 1000;

@Injectable()
export class LichessOAuthStateService {
  constructor(
    @InjectRepository(LichessOAuthState)
    private readonly statesRepository: Repository<LichessOAuthState>,
  ) {}

  async createState({
    now = new Date(),
    redirectUri,
    userId,
  }: {
    now?: Date;
    redirectUri: string;
    userId: string;
  }): Promise<{
    codeChallenge: string;
    codeVerifier: string;
    expiresAt: Date;
    state: string;
  }> {
    const state = this.randomUrlSafeSecret();
    const codeVerifier = this.randomUrlSafeSecret(64);
    const expiresAt = new Date(now.getTime() + stateTtlMs);

    await this.statesRepository.save(
      this.statesRepository.create({
        codeVerifier,
        expiresAt,
        redirectUri,
        stateHash: this.hashState(state),
        userId,
      }),
    );

    return {
      codeChallenge: this.toCodeChallenge(codeVerifier),
      codeVerifier,
      expiresAt,
      state,
    };
  }

  async consumeState({
    now = new Date(),
    state,
    userId,
  }: {
    now?: Date;
    state: string;
    userId: string;
  }): Promise<LichessOAuthState | null> {
    const oauthState = await this.statesRepository.findOne({
      where: { stateHash: this.hashState(state), userId },
    });

    if (
      !oauthState ||
      oauthState.consumedAt ||
      oauthState.expiresAt.getTime() <= now.getTime()
    ) {
      return null;
    }

    oauthState.consumedAt = now;

    return this.statesRepository.save(oauthState);
  }

  hashState(state: string): string {
    return createHash('sha256').update(state).digest('hex');
  }

  private randomUrlSafeSecret(bytes = 32): string {
    return randomBytes(bytes).toString('base64url');
  }

  private toCodeChallenge(codeVerifier: string): string {
    return createHash('sha256').update(codeVerifier).digest('base64url');
  }
}
