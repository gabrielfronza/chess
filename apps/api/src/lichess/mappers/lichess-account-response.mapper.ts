import { Injectable } from '@nestjs/common';
import type { LichessAccountResponse } from '@checkmatetour/contracts';
import { LichessAccount } from '../entities';

@Injectable()
export class LichessAccountResponseMapper {
  toResponse(account: LichessAccount): LichessAccountResponse {
    return {
      id: account.id,
      linkedAt: account.createdAt.toISOString(),
      lichessUserId: account.lichessUserId,
      revokedAt: account.revokedAt?.toISOString() ?? null,
      username: account.username,
    };
  }
}
