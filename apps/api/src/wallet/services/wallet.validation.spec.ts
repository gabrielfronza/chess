import { BadRequestException } from '@nestjs/common';
import {
  validateWalletAdjustment,
  validateWalletHistory,
} from './wallet.validation';

describe('wallet validation', () => {
  it('defaults and validates history pagination', () => {
    expect(validateWalletHistory({})).toEqual({ page: 1, pageSize: 20 });
    expect(validateWalletHistory({ page: '2', pageSize: '10' })).toEqual({
      page: 2,
      pageSize: 10,
    });
  });

  it('requires a non-zero integer adjustment with audit fields', () => {
    expect(
      validateWalletAdjustment({
        amountCents: 500,
        idempotencyKey: 'adjust-001',
        reason: 'Customer support correction',
      }),
    ).toEqual({
      amountCents: 500,
      idempotencyKey: 'adjust-001',
      reason: 'Customer support correction',
    });
    expect(() =>
      validateWalletAdjustment({
        amountCents: 0,
        idempotencyKey: 'adjust-001',
        reason: 'Correction',
      }),
    ).toThrow(BadRequestException);
  });
});
