import { createZodDto } from 'nestjs-zod';
import { ZodTypeAny, z } from 'zod';

export type PostApiResponseSchema<T> = {
  data: T;
  message: string;
};

// Create a Zod schema for an API response with dynamic data
export const CreateZodApiDtoSchema = <T extends ZodTypeAny>(schema: T) => {
  return createZodDto(
    z.object({
      data: schema, // Use the passed schema for `data`
      message: z.string(), // Always expect a string for `message`
    })
  );
};
export const CreateZodApiDtoWithPagination = <T extends ZodTypeAny>(
  schema: T
) => {
  return z.object({
    data: schema,
    pagination: z.object({
      totalCount: z.number(),
      pageSize: z.number(),
      totalPages: z.number(),
      hasNextPage: z.number(),
    }),
  });
};