import { Types } from "mongoose";
import { Timestamps } from "src/types/timestamps";
import { z } from "zod";

export const ProductSchemaEntity = z.object({
  title: z.string(),
  description: z.string().max(500).optional(),
  price: z.number().min(0),
  quantity: z.number().int().min(0),
  category: z.string(),
  options: z.array(
    z.object({
      option: z.string().min(1),
      values: z.array(z.string().min(1)),
    })
  ),
  owner: z.string().min(3),
  _id: z.instanceof(Types.ObjectId),
  ...Timestamps,
});

export type ProductSchemaEntityType = z.infer<typeof ProductSchemaEntity>;
