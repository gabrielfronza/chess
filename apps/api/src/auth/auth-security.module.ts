import { Module } from '@nestjs/common';
import { AuthGuard } from './guards';
import { JwtVerifier } from './providers';

@Module({
  exports: [AuthGuard, JwtVerifier],
  providers: [AuthGuard, JwtVerifier],
})
export class AuthSecurityModule {}
