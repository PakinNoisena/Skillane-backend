import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const userRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  identificationNo: z.string().length(13),
  dob: z.coerce.date().max(new Date()),
  phoneNo: z
    .string()
    .length(10)
    .regex(/^\d+$/, { message: 'Invalid format' })
    .transform((val) => Number(val)),
  profileImg: z.string().optional(),
  googleId: z.string().optional(),
});

export class UserRegisterDTO extends createZodDto(userRegisterSchema) {}
