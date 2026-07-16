import { Injectable } from '@nestjs/common';
import { LichessAccount } from '../entities';

export type LichessAccountResponse = {
  id: string;
  linkedAt: string;
  lichessUserId: string;
  revokedAt: string | null;
  username: string;
};

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
