import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().optional(),
  NODE_ENV: z.string(z.enum(['development', 'production', 'test'])),
  JWT_SECRET: z.string().min(10),
  MONGO_DB_URL: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;
