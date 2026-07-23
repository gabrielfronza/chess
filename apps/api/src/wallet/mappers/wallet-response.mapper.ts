import { Injectable } from '@nestjs/common';
import type {
  WalletBalanceResponse,
  WalletEntryResponse,
} from '@checkmatetour/contracts';
import { Wallet, WalletEntry } from '../entities';

@Injectable()
export class WalletResponseMapper {
  toBalance(wallet: Wallet): WalletBalanceResponse {
    return {
      availableBalanceCents: wallet.availableBalanceCents,
      currency: 'USD',
      reservedBalanceCents: wallet.reservedBalanceCents,
    };
  }

  toEntry(entry: WalletEntry): WalletEntryResponse {
    return {
      amountCents: entry.amountCents,
      createdAt: entry.createdAt.toISOString(),
      id: entry.id,
      reason: entry.reason,
      reference: entry.reference,
      type: entry.type,
    };
  }
}
