import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const RegisterUserSchema = z.object({
  userName: z.string().min(3),
  firstName: z.string().min(3).optional(),
  lastName: z.string().min(3).optional(),
  password: z.string().min(8),
});
const LoginUserSchema = RegisterUserSchema.pick({
  userName: true,
  password: true,
});
export class LoginUserDto extends createZodDto(LoginUserSchema) {}
export class RegisterUserDto extends createZodDto(RegisterUserSchema) {}
export class UpdateUserDto extends createZodDto(RegisterUserSchema.partial()) {}
