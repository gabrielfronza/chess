import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicKey, KeyObject, verify as verifySignature } from 'crypto';
import type { JsonWebKey } from 'crypto';
import { Environment } from '../../config/environment';
import { AuthenticatedUser } from '../types';

type JwtHeader = {
  alg?: string;
  kid?: string;
  typ?: string;
};

type JwtPayload = {
  aud?: string | string[];
  email?: unknown;
  exp?: number;
  iss?: string;
  nbf?: number;
  sub?: string;
};

type JsonWebKeySet = {
  keys: JsonWebKey[];
};

type UserInfoPayload = {
  email?: unknown;
};

@Injectable()
export class JwtVerifier {
  private readonly audience: string;
  private readonly issuer: string;
  private readonly jwksUrl: URL;
  private readonly userInfoUrl: URL;
  private readonly publicKeys = new Map<string, KeyObject>();

  constructor(config: ConfigService<Environment, true>) {
    const domain = config.get('AUTH0_DOMAIN', { infer: true });

    this.audience = config.get('AUTH0_AUDIENCE', { infer: true });
    this.issuer = JwtVerifier.createAuth0Issuer(domain);
    this.jwksUrl = new URL(`${this.issuer}.well-known/jwks.json`);
    this.userInfoUrl = new URL(`${this.issuer}userinfo`);
  }

  public static createAuth0Issuer(domain: string): string {
    const normalizedDomain = domain
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/\/+$/, '');

    return `https://${normalizedDomain}/`;
  }

  async verify(token: string): Promise<AuthenticatedUser> {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !encodedSignature) {
      throw new Error('JWT must have header, payload, and signature segments');
    }

    const header = JwtVerifier.decodeJwtPart<JwtHeader>(encodedHeader);

    if (header.alg !== 'RS256' || !header.kid) {
      throw new Error('JWT must be signed with an Auth0 RS256 key');
    }

    const publicKey = await this.getPublicKey(header.kid);
    const isValidSignature = verifySignature(
      'RSA-SHA256',
      Buffer.from(`${encodedHeader}.${encodedPayload}`),
      publicKey,
      Buffer.from(encodedSignature, 'base64url'),
    );

    if (!isValidSignature) {
      throw new Error('JWT signature is invalid');
    }

    const payload = JwtVerifier.decodeJwtPart<JwtPayload>(encodedPayload);

    this.validatePayload(payload);

    return this.toAuthenticatedUser(payload, token);
  }

  private async getPublicKey(kid: string): Promise<KeyObject> {
    const cachedKey = this.publicKeys.get(kid);

    if (cachedKey) {
      return cachedKey;
    }

    const response = await fetch(this.jwksUrl);

    if (!response.ok) {
      throw new Error('Unable to load Auth0 JWKS');
    }

    const jwks = (await response.json()) as JsonWebKeySet;
    const jwk = jwks.keys.find((key) => key.kid === kid);

    if (!jwk) {
      throw new Error('Auth0 signing key not found');
    }

    const publicKey = createPublicKey({ format: 'jwk', key: jwk });

    this.publicKeys.set(kid, publicKey);

    return publicKey;
  }

  private validatePayload(payload: JwtPayload): void {
    const now = Math.floor(Date.now() / 1000);

    if (payload.iss !== this.issuer) {
      throw new Error('JWT issuer is invalid');
    }

    if (!JwtVerifier.isValidAudience(payload.aud, this.audience)) {
      throw new Error('JWT audience is invalid');
    }

    if (typeof payload.exp !== 'number' || payload.exp <= now) {
      throw new Error('JWT is expired');
    }

    if (typeof payload.nbf === 'number' && payload.nbf > now) {
      throw new Error('JWT is not active yet');
    }
  }

  private async toAuthenticatedUser(
    payload: JwtPayload,
    token: string,
  ): Promise<AuthenticatedUser> {
    if (!payload.sub) {
      throw new Error('JWT subject is required');
    }

    return {
      sub: payload.sub,
      email:
        JwtVerifier.readStringClaim(payload, 'email') ??
        (await this.loadEmailFromUserInfo(token)),
    };
  }

  private async loadEmailFromUserInfo(
    accessToken: string,
  ): Promise<string | undefined> {
    try {
      const response = await fetch(this.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        return undefined;
      }

      const userInfo = (await response.json()) as UserInfoPayload;

      return JwtVerifier.readStringClaim(userInfo, 'email');
    } catch {
      return undefined;
    }
  }

  private static readStringClaim(
    payload: Pick<JwtPayload, 'email'>,
    claim: 'email',
  ): string | undefined {
    const value = payload[claim];

    return typeof value === 'string' && value.trim() ? value : undefined;
  }

  private static decodeJwtPart<T>(encodedPart: string): T {
    return JSON.parse(
      Buffer.from(encodedPart, 'base64url').toString('utf8'),
    ) as T;
  }

  private static isValidAudience(
    tokenAudience: string | string[] | undefined,
    requiredAudience: string,
  ): boolean {
    return Array.isArray(tokenAudience)
      ? tokenAudience.includes(requiredAudience)
      : tokenAudience === requiredAudience;
  }
}
