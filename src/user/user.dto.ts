import { createZodDto } from 'nestjs-zod';
import { RegisterUserDto } from 'src/auth/auth.dto';
import { z } from 'zod';

export const UpdateUserSchema = z
  .object({
    ...RegisterUserDto.pick({
      firstName: true,
      lastName: true,
      password: true,
    }).shape,
  })
  .partial();

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;
