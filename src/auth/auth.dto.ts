import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const accRecoverySchema = z.object({
  email: z.string().email(),
});

export class AccRecoveryDTO extends createZodDto(accRecoverySchema) {}

const resetPasswordSchema = z.object({
  email: z.string().email(),
  resetToken: z.string(),
  newPassword: z.string().min(4),
});

export class ResetPasswordDTO extends createZodDto(resetPasswordSchema) {}
