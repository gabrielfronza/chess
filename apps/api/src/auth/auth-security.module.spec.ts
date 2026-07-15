import { AuthSecurityModule } from './auth-security.module';
import { AuthGuard } from './guards';
import { JwtVerifier } from './providers';

describe('AuthSecurityModule', () => {
  it('groups reusable authentication providers for feature modules', () => {
    expect(AuthSecurityModule).toBeDefined();
    expect(AuthGuard).toBeDefined();
    expect(JwtVerifier).toBeDefined();
  });
});
