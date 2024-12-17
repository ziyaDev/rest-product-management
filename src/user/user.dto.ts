import { RegisterUserDto } from 'src/auth/auth.dto';
import { z } from 'zod';

export const UpdateUserDto = z
  .object({
    ...RegisterUserDto.shape,
  })
  .partial();
