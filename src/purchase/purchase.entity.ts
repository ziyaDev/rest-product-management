import { ProductSchemaEntity } from 'src/product/product.entity';
import { Timestamps } from 'src/types/timestamps';
import { UserSchemaEntity } from 'src/user/user.entity';
import { z } from 'zod';

export const PurchaseSchemaEntity = z.object({
  product: ProductSchemaEntity.pick({
    title: true,
    description: true,
    category: true,
    createdAt: true,
  }),
  owner: UserSchemaEntity.pick({
    userName: true,
    firstName: true,
    lastName: true,
    _id: true,
  }),
  totalPrice: z.coerce.number(),
  quantity: z.coerce.number(),
  selectedOptions: z.array(
    z.object({
      option: z.string(),
      value: z.string(),
    })
  ),
  ...Timestamps,
});

export type PurchaseSchemaEntityType = z.infer<typeof PurchaseSchemaEntity>;
