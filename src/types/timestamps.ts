import { z } from 'zod';

export const Timestamps = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
}).shape;
