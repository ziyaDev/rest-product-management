import { Types } from 'mongoose';
import { RegisterUserDto } from 'src/auth/auth.dto';
import { Timestamps } from 'src/types/timestamps';
import { z } from 'zod';
export const UserSchemaEntity = z.object({
  ...RegisterUserDto.pick({
    userName: true,
    firstName: true,
    lastName: true,
  }).shape,
  _id: z.instanceof(Types.ObjectId),
  ...Timestamps,
});
export const UserLoginSchemaEntity = z.object({
  ...UserSchemaEntity.shape,
  access_token: z
    .string()
    // This JWT validator has been created by devin :D https://github.com/colinhacks/zod/commit/b68c05fea12d8060000aa06abc1e95b08f061378
    .jwt(),
});
