import { Types } from 'mongoose';
import { z } from 'zod';
import { RegisterUserSchema } from './user.dto';
export const UserSchemaEntity = z.object({
  ...RegisterUserSchema.pick({
    userName: true,
    firstName: true,
    lastName: true,
  }).shape,
  _id: z.instanceof(Types.ObjectId),
});
export const UserLoginSchemaEntity = z.object({
  ...UserSchemaEntity.shape,
  access_token: z.string(),
});
