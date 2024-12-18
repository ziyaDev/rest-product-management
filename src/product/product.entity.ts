import { Types } from 'mongoose';
import { Timestamps } from 'src/types/timestamps';
import { UserSchemaEntity } from 'src/user/user.entity';
import { z } from 'zod';

export const ProductSchemaEntity = z.object({
  title: z.string(),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  quantity: z.coerce.number().int().min(0),
  category: z.string().optional(),
  options: z.array(
    z.object({
      option: z.string().min(1),
      values: z.array(z.string().min(1)),
    })
  ),
  owner: z.union([
    z.string().min(3),
    UserSchemaEntity.pick({
      _id: true,
      lastName: true,
      firstName: true,
      userName: true,
    }),
  ]),
  _id: z.instanceof(Types.ObjectId),
  ...Timestamps,
});

export type ProductSchemaEntityType = z.infer<typeof ProductSchemaEntity>;
