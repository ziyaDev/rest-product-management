import { Types } from 'mongoose';
import { z } from 'zod';

export const CreatePurchaseDto = z.object({
  productId: z.instanceof(Types.ObjectId),
  quantity: z.number().int().gte(1),
  // selectedOptions: z.array(),
});
