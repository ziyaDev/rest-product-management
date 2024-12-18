import { Product, ProductSchema } from './product.schema';
import { Purchase, PurchaseSchema } from './purchase.schema';
import { User, UserSchema } from './user.schema';

export default [
  { name: User.name, schema: UserSchema },
  {
    name: Product.name,
    schema: ProductSchema,
  },
  {
    name: Purchase.name,
    schema: PurchaseSchema,
  },
];
