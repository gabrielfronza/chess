import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { JwtVerifier } from '../providers';

describe('AuthGuard', () => {
  function createContext(authorization?: string | string[]): {
    context: ExecutionContext;
    request: { headers: { authorization?: string | string[] }; user?: unknown };
  } {
    const request = { headers: { authorization } };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    return { context, request };
  }

  it('accepts valid bearer tokens and attaches the authenticated user', async () => {
    const verify = jest.fn().mockResolvedValue({ sub: 'auth0|123' });
    const verifier = {
      verify,
    } as unknown as JwtVerifier;
    const guard = new AuthGuard(verifier);
    const { context, request } = createContext('Bearer valid-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);

    expect(verify).toHaveBeenCalledWith('valid-token');
    expect(request.user).toEqual({ sub: 'auth0|123' });
  });

  it('rejects missing tokens', async () => {
    const verify = jest.fn();
    const verifier = {
      verify,
    } as unknown as JwtVerifier;
    const guard = new AuthGuard(verifier);
    const { context } = createContext();

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(verify).not.toHaveBeenCalled();
  });

  it('rejects malformed or non-bearer authorization values', async () => {
    const verify = jest.fn();
    const verifier = {
      verify,
    } as unknown as JwtVerifier;
    const guard = new AuthGuard(verifier);

    for (const authorization of [
      ['Bearer token'],
      'Basic token',
      'Bearer',
      'Bearer token extra',
    ]) {
      const { context } = createContext(authorization);

      await expect(guard.canActivate(context)).rejects.toThrow(
        'Missing bearer token',
      );
    }

    expect(verify).not.toHaveBeenCalled();
  });

  it('rejects invalid tokens without leaking verifier errors', async () => {
    const verify = jest
      .fn()
      .mockRejectedValue(new Error('jwks failure detail'));
    const verifier = {
      verify,
    } as unknown as JwtVerifier;
    const guard = new AuthGuard(verifier);
    const { context } = createContext('Bearer invalid-token');

    await expect(guard.canActivate(context)).rejects.toThrow(
      'Invalid bearer token',
    );
  });
});
