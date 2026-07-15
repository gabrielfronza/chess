import { z } from 'zod';

export const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  APP_VERSION: z.string().trim().min(1).default('0.1.0'),
  CORS_ALLOWED_ORIGINS: z
    .string()
    .trim()
    .min(1)
    .default(
      [
        'http://localhost:8081',
        'http://localhost:19006',
        'http://127.0.0.1:8081',
        'http://127.0.0.1:19006',
      ].join(','),
    ),
  DATABASE_URL: z.string().trim().url(),
  AUTH0_DOMAIN: z.string().trim().min(1),
  AUTH0_AUDIENCE: z.string().trim().url(),
});

export type Environment = z.infer<typeof environmentSchema>;

export function validateEnvironment(
  configuration: Record<string, unknown>,
): Environment {
  const result = environmentSchema.safeParse(configuration);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');

    throw new Error(`Invalid environment configuration: ${details}`);
  }

  return result.data;
}
