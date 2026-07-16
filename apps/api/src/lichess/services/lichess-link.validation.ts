import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

export const completeLichessOAuthSchema = z.object({
  code: z.string().trim().min(1),
  state: z.string().trim().min(1),
});

export type CompleteLichessOAuthInput = z.infer<
  typeof completeLichessOAuthSchema
>;

export function validateCompleteLichessOAuth(
  body: unknown,
): CompleteLichessOAuthInput {
  const result = completeLichessOAuthSchema.safeParse(body);

  if (!result.success) {
    throw new BadRequestException('Invalid Lichess OAuth callback payload');
  }

  return result.data;
}
