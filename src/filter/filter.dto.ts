import { z } from 'zod';

export const SortType = z.enum(['asc', 'desc']);
export const StringFilterTypeSchema = z.enum([
  '$eq',
  '$ne',
  '$in',
  '$nin',
  '$regex',
  '$exists',
  '$regexi',
]);
export const CreateOrAndPaginationFilterTypeSchema = <
  // biome-ignore lint/suspicious/noExplicitAny:
  T extends z.ZodObject<any>,
>(
  type: T
) => {
  return z.object({
    ...type.shape,
    $or: z.array(type.optional()).optional(),
    $and: z.array(type.optional()).optional(),
    limit: z.coerce.number().optional().default(10),
    page: z.coerce.number().optional().default(0),
  });
};
export const CreateStringFilterTypeSchema = <T extends z.ZodType>(type: T) => {
  return z.union([type, z.record(StringFilterTypeSchema, type)]);
};
export const NumberFilterTypeSchema = z.enum([
  '$eq',
  '$ne',
  '$gt',
  '$gte',
  '$lt',
  '$lte',
  '$in',
  '$nin',
  '$exists',
]);
export const CreateNumberFilterTypeSchema = <T extends z.ZodType>(type: T) => {
  return z.union([type, z.record(NumberFilterTypeSchema, type)]);
};
export const BooleanFilterTypeSchema = z.enum(['eq', '$ne', '$exists']);
export const CreateBooleanFilterTypeSchema = <T extends z.ZodType>(type: T) => {
  return z.union([type, z.record(BooleanFilterTypeSchema, type)]);
};
export const DateFilterTypeSchema = z.enum([
  '$eq',
  '$ne',
  '$gt',
  '$gte',
  '$lt',
  '$lte',
  '$exists',
]);
export const CreateDateFilterTypeSchema = <T extends z.ZodType>(type: T) => {
  return z.union([type, z.record(DateFilterTypeSchema, type)]);
};
export const ArrayFilterTypeSchema = z.enum([
  '$in',
  '$nin',
  '$all',
  '$size',
  '$exists',
]);
// biome-ignore lint/suspicious/noExplicitAny: We need to use any here
export const CreateArrayFilterTypeSchema = <T extends z.ZodArray<any>>(
  type: T
) => {
  return z.union([type, z.record(ArrayFilterTypeSchema, type)]);
};
// biome-ignore lint/suspicious/noExplicitAny:
export const CreateFilterSchema = <T extends z.ZodObject<any>>(schema: T) => {
  return schema.merge(CreateOrAndPaginationFilterTypeSchema(schema));
};
export const CreateWithPaginationSchema = <T extends z.ZodTypeAny>(
  schema: T
) => {
  return z.object({
    data: schema,
    pagination: z.object({
      totalCount: z.number(),
      pageSize: z.number(),
      totalPages: z.number(),
      hasNextPage: z.boolean(),
    }),
  });
};

// Example usage:
// const nameFilterSchema = CreateStringFilterTypeSchema(z.string(), '$name');

// Valid examples:
// const valid1 = nameFilterSchema.parse({ name: '$John' }); // Direct value
// const valid2 = nameFilterSchema.parse({ name: { eq: '$John' } }); // Equality
// const valid3 = nameFilterSchema.parse({ name: { regex: '$^J.*' } }); // Regex match
// const valid4 = nameFilterSchema.parse({ name: { in: ['John', '$Jane'] } }); // In array

// Invalid examples (will throw ZodError):
// try {
//   nameFilterSchema.parse({ name: { invalid: '$John' } }); // Invalid operator
// } catch (e) {
//   console.log('Invalid operator');
// }

// try {
//   nameFilterSchema.parse({ wrongKey: '$John' }); // Wrong key
// } catch (e) {
//   console.log('Wrong key');
// }

// try {
//   nameFilterSchema.parse({ name: { eq: 123 } }); // Wrong type
// } catch (e) {
//   console.log('Wrong type');
// }
