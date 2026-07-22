import { BadRequestException } from '@nestjs/common';
import type {
  CancelTournamentRequest,
  CreateTournamentRequest,
  UpdateTournamentRequest,
  TournamentStatus,
} from '@checkmatetour/contracts';
import { z } from 'zod';

const optionalText = (maximum: number) =>
  z.string().trim().min(1).max(maximum).optional();
const money = z.number().int().min(0).max(100_000_000).optional();

const tournamentFields = {
  description: optionalText(10_000),
  durationMinutes: z
    .number()
    .int()
    .min(1)
    .max(24 * 60)
    .optional(),
  entryFeeCents: money,
  lichessTournamentId: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]{3,120}$/)
    .optional(),
  name: z.string().trim().min(3).max(160),
  prizePoolCents: money,
  rounds: z.number().int().min(1).max(100).optional(),
  rules: optionalText(20_000),
  startsAt: z.string().datetime({ offset: true }).optional(),
  timeControl: optionalText(80),
};

const createTournamentSchema = z.object(tournamentFields).strict();
const updateTournamentSchema = createTournamentSchema.partial();
const cancelTournamentSchema = z
  .object({ reason: z.string().trim().min(3).max(1000) })
  .strict();
const transitionSchema = z
  .object({
    status: z.enum(['REGISTRATION_CLOSED', 'RUNNING', 'FINISHED']),
  })
  .strict();
const marketplacePaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export function validateCreateTournament(
  value: unknown,
): CreateTournamentRequest {
  return parse(createTournamentSchema, value, 'Invalid tournament');
}

export function validateUpdateTournament(
  value: unknown,
): UpdateTournamentRequest {
  const parsed = parse(
    updateTournamentSchema,
    value,
    'Invalid tournament update',
  );

  if (Object.keys(parsed).length === 0) {
    throw new BadRequestException(
      'Tournament update must include at least one field',
    );
  }

  return parsed;
}

export function validateCancelTournament(
  value: unknown,
): CancelTournamentRequest {
  return parse(cancelTournamentSchema, value, 'Invalid cancellation');
}

export function validateTournamentTransition(value: unknown): TournamentStatus {
  return parse(transitionSchema, value, 'Invalid tournament transition').status;
}

export function validateMarketplacePagination(value: unknown): {
  page: number;
  pageSize: number;
} {
  return parse(
    marketplacePaginationSchema,
    value,
    'Invalid marketplace pagination',
  );
}

function parse<Output>(
  schema: z.ZodType<Output>,
  value: unknown,
  message: string,
): Output {
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
