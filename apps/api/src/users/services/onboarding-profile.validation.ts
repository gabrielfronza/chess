import { BadRequestException } from '@nestjs/common';
import type { UpdateOnboardingProfileRequest } from '@checkmatetour/contracts';
import { z } from 'zod';

export const minimumUserAge = 18;

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

const updateOnboardingProfileSchema = z.object({
  country: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{2}$/, 'country must be an ISO 3166-1 alpha-2 code')
    .transform((country) => country.toUpperCase()),
  dateOfBirth: z
    .string()
    .trim()
    .regex(isoDatePattern, 'dateOfBirth must use YYYY-MM-DD format')
    .refine(isValidDateOnly, 'dateOfBirth must be a valid date')
    .refine(isAdult, `user must be at least ${minimumUserAge} years old`),
  displayName: z.string().trim().min(2).max(80),
});

export type UpdateOnboardingProfileInput = UpdateOnboardingProfileRequest;

export function validateUpdateOnboardingProfile(
  value: unknown,
): UpdateOnboardingProfileInput {
  const parsed = updateOnboardingProfileSchema.safeParse(value);

  if (!parsed.success) {
    throw new BadRequestException({
      errors: parsed.error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path.join('.'),
      })),
      message: 'Invalid onboarding profile',
    });
  }

  return parsed.data;
}

function isValidDateOnly(value: string): boolean {
  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function isAdult(value: string): boolean {
  const today = new Date();
  const birthDate = new Date(`${value}T00:00:00.000Z`);
  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
  const monthDelta = today.getUTCMonth() - birthDate.getUTCMonth();
  const dayDelta = today.getUTCDate() - birthDate.getUTCDate();

  if (monthDelta < 0 || (monthDelta === 0 && dayDelta < 0)) {
    age -= 1;
  }

  return age >= minimumUserAge;
}
