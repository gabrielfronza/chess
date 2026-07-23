import { BadRequestException } from '@nestjs/common';
import type { AdminWalletAdjustmentRequest } from '@checkmatetour/contracts';
import { z } from 'zod';

const historySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

const adjustmentSchema = z
  .object({
    amountCents: z.number().int().safe().min(-100_000_000).max(100_000_000),
    idempotencyKey: z.string().trim().min(8).max(200),
    reason: z.string().trim().min(3).max(1000),
    reference: z.string().trim().min(1).max(200).optional(),
  })
  .refine((value) => value.amountCents !== 0, {
    message: 'Adjustment amount cannot be zero',
    path: ['amountCents'],
  });

export function validateWalletHistory(value: unknown) {
  return parse(historySchema, value, 'Invalid wallet history pagination');
}

export function validateWalletAdjustment(
  value: unknown,
): AdminWalletAdjustmentRequest {
  return parse(adjustmentSchema, value, 'Invalid wallet adjustment');
}

function parse<Output>(
  schema: z.ZodType<Output>,
  value: unknown,
  message: string,
) {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new BadRequestException({
      errors: result.error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path.join('.'),
      })),
      message,
    });
  }
  return result.data;
}
