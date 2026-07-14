import { ConfigService } from '@nestjs/config';
import { generateKeyPairSync, KeyObject, sign } from 'crypto';
import { Environment } from '../../config/environment';
import { JwtVerifier } from '.';

describe('JwtVerifier.createAuth0Issuer', () => {
  it('normalizes Auth0 domains to the issuer URL expected by JWT validation', () => {
    expect(JwtVerifier.createAuth0Issuer('example.auth0.com')).toBe(
      'https://example.auth0.com/',
    );
    expect(JwtVerifier.createAuth0Issuer('https://example.auth0.com/')).toBe(
      'https://example.auth0.com/',
    );
  });
});

describe('JwtVerifier', () => {
  const audience = 'https://api.chess.local';
  const issuer = 'https://example.auth0.com/';
  const kid = 'story-004-key';
  const nowInSeconds = 2_000_000_000;
  let privateKey: KeyObject;
  let publicKey: KeyObject;
  let verifier: JwtVerifier;

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(nowInSeconds * 1000);

    const keys = generateKeyPairSync('rsa', { modulusLength: 2048 });
    privateKey = keys.privateKey;
    publicKey = keys.publicKey;
    global.fetch = jest.fn((input: URL | string) => {
      const url = input.toString();

      if (url.endsWith('/userinfo')) {
        return Promise.resolve({
          json: jest.fn().mockResolvedValue({}),
          ok: true,
        });
      }

      return Promise.resolve(createJwksResponse());
    });
    verifier = new JwtVerifier(
      createConfigService({
        AUTH0_AUDIENCE: audience,
        AUTH0_DOMAIN: 'https://example.auth0.com/',
      }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('validates Auth0 RS256 tokens and maps safe user claims', async () => {
    await expect(
      verifier.verify(
        createToken({
          email: 'player@example.com',
          sub: 'auth0|123',
        }),
      ),
    ).resolves.toEqual({
      email: 'player@example.com',
      sub: 'auth0|123',
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('loads email from Auth0 userinfo when the access token omits email', async () => {
    (global.fetch as jest.Mock).mockImplementation((input: URL | string) => {
      const url = input.toString();

      if (url.endsWith('/userinfo')) {
        return Promise.resolve({
          json: jest.fn().mockResolvedValue({ email: 'player@example.com' }),
          ok: true,
        });
      }

      return Promise.resolve(createJwksResponse());
    });

    const token = createToken({ sub: 'auth0|123' });

    await expect(verifier.verify(token)).resolves.toEqual({
      email: 'player@example.com',
      sub: 'auth0|123',
    });

    expect(global.fetch).toHaveBeenCalledWith(
      new URL('https://example.auth0.com/userinfo'),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  });

  it('keeps email optional when Auth0 userinfo does not return a usable email', async () => {
    (global.fetch as jest.Mock).mockImplementation((input: URL | string) => {
      const url = input.toString();

      if (url.endsWith('/userinfo')) {
        return Promise.resolve({
          json: jest.fn().mockResolvedValue({}),
          ok: true,
        });
      }

      return Promise.resolve(createJwksResponse());
    });

    await expect(
      verifier.verify(createToken({ sub: 'auth0|123' })),
    ).resolves.toEqual({
      email: undefined,
      sub: 'auth0|123',
    });
  });

  it('keeps authentication valid when Auth0 userinfo is unavailable', async () => {
    (global.fetch as jest.Mock).mockImplementation((input: URL | string) => {
      const url = input.toString();

      if (url.endsWith('/userinfo')) {
        return Promise.resolve({ ok: false });
      }

      return Promise.resolve(createJwksResponse());
    });

    await expect(
      verifier.verify(createToken({ sub: 'auth0|123' })),
    ).resolves.toEqual({
      email: undefined,
      sub: 'auth0|123',
    });

    (global.fetch as jest.Mock).mockImplementation((input: URL | string) => {
      const url = input.toString();

      if (url.endsWith('/userinfo')) {
        return Promise.reject(new Error('network error'));
      }

      return Promise.resolve(createJwksResponse());
    });
    verifier = new JwtVerifier(
      createConfigService({
        AUTH0_AUDIENCE: audience,
        AUTH0_DOMAIN: 'https://example.auth0.com/',
      }),
    );

    await expect(
      verifier.verify(createToken({ sub: 'auth0|123' })),
    ).resolves.toEqual({
      email: undefined,
      sub: 'auth0|123',
    });
  });

  it('caches JWKS keys after the first successful verification', async () => {
    await verifier.verify(
      createToken({ email: 'player@example.com', sub: 'auth0|123' }),
    );
    await verifier.verify(
      createToken({ email: 'player@example.com', sub: 'auth0|456' }),
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('rejects malformed tokens', async () => {
    await expect(verifier.verify('not-a-jwt')).rejects.toThrow(
      'JWT must have header, payload, and signature segments',
    );
  });

  it('rejects tokens without an Auth0 RS256 key id', async () => {
    await expect(
      verifier.verify(
        createToken({ sub: 'auth0|123' }, { header: { alg: 'HS256' } }),
      ),
    ).rejects.toThrow('JWT must be signed with an Auth0 RS256 key');
  });

  it('rejects invalid signatures', async () => {
    const otherKeys = generateKeyPairSync('rsa', { modulusLength: 2048 });

    await expect(
      verifier.verify(
        createToken({ sub: 'auth0|123' }, { signingKey: otherKeys.privateKey }),
      ),
    ).rejects.toThrow('JWT signature is invalid');
  });

  it('rejects invalid issuer, audience, expiry, and missing subject claims', async () => {
    await expect(
      verifier.verify(createToken({ iss: 'https://wrong.example.com/' })),
    ).rejects.toThrow('JWT issuer is invalid');

    await expect(
      verifier.verify(createToken({ aud: 'wrong-audience' })),
    ).rejects.toThrow('JWT audience is invalid');

    await expect(
      verifier.verify(createToken({ exp: nowInSeconds })),
    ).rejects.toThrow('JWT is expired');

    await expect(
      verifier.verify(createToken({ nbf: nowInSeconds + 10 })),
    ).rejects.toThrow('JWT is not active yet');

    await expect(
      verifier.verify(createToken({ sub: undefined })),
    ).rejects.toThrow('JWT subject is required');
  });

  it('rejects unavailable JWKS responses and unknown signing keys', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    await expect(
      verifier.verify(createToken({ sub: 'auth0|123' })),
    ).rejects.toThrow('Unable to load Auth0 JWKS');

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ keys: [] }),
      ok: true,
    });

    await expect(
      verifier.verify(createToken({ sub: 'auth0|123' })),
    ).rejects.toThrow('Auth0 signing key not found');
  });

  function createToken(
    payloadOverrides: Partial<{
      aud: string | string[];
      email: string;
      exp: number;
      iss: string;
      nbf: number;
      sub?: string;
    }>,
    options: {
      header?: Partial<{ alg: string; kid: string; typ: string }>;
      signingKey?: KeyObject;
    } = {},
  ): string {
    const header = {
      alg: 'RS256',
      kid,
      typ: 'JWT',
      ...options.header,
    };
    const payload = {
      aud: audience,
      exp: nowInSeconds + 60,
      iss: issuer,
      sub: 'auth0|123',
      ...payloadOverrides,
    };
    const encodedHeader = encodeJwtPart(header);
    const encodedPayload = encodeJwtPart(payload);
    const encodedSignature = sign(
      'RSA-SHA256',
      Buffer.from(`${encodedHeader}.${encodedPayload}`),
      options.signingKey ?? privateKey,
    ).toString('base64url');

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  function createJwksResponse(): {
    json: jest.Mock;
    ok: boolean;
  } {
    return {
      json: jest.fn().mockResolvedValue({
        keys: [
          {
            ...publicKey.export({ format: 'jwk' }),
            kid,
          },
        ],
      }),
      ok: true,
    };
  }
});

function createConfigService(
  values: Pick<Environment, 'AUTH0_AUDIENCE' | 'AUTH0_DOMAIN'>,
): ConfigService<Environment, true> {
  return {
    get: jest.fn((key: keyof typeof values) => values[key]),
  } as unknown as ConfigService<Environment, true>;
}

function encodeJwtPart(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}
