import { z } from 'zod';

export const RegisterUserDto = z.object({
  userName: z
    .string()
    .min(3)
    .transform((val) => val.toLowerCase().replace(/ /g, '_')),
  firstName: z.string().min(3).optional(),
  lastName: z.string().min(3).optional(),
  password: z.string().min(8),
});
export const LoginUserDto = RegisterUserDto.pick({
  userName: true,
  password: true,
});
