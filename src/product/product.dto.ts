import { createZodDto, ZodValidationException } from 'nestjs-zod';
import { z, ZodError } from 'zod';
import { ProductSchemaEntity } from './product.entity';

export const CreateProductSchema = z
  .object({
    ...ProductSchemaEntity.pick({
      title: true,
      description: true,
      price: true,
      quantity: true,
      category: true,
      options: true,
    }).shape,
  })
  .extend({
    title: z.string().min(3).max(100),
    category: z.string().min(2),
    description: z.string().max(500).optional(),
  })
  .superRefine((args) => {
    // we have to validate options
    // options.option should be unique
    // options.values should be unique alos
    // since options are optional field so
    if (args.options?.length) {
      args.options.reduce((prev, curr, index) => {
        // if option name already in
        // we have to throw ZodValidationException so we can catch it later
        const normalizedOption = curr.option.toLowerCase();
        if (prev.has(normalizedOption)) {
          throw new ZodValidationException(
            new ZodError([
              {
                code: z.ZodIssueCode.custom,
                message: `Duplicate option found: ${normalizedOption}`,
                path: ['options', index],
              },
            ])
          );
        }
        prev.set(normalizedOption, [
          ...new Set(curr.values.map((v) => v.toLowerCase())),
        ]);
        // also validate unique for each option values
        if (curr.values.length !== prev.get(normalizedOption).length) {
          throw new ZodValidationException(
            new ZodError([
              {
                code: z.ZodIssueCode.custom,
                message: `Duplicate option values found: ${curr.option.toLocaleLowerCase()}`,
                path: ['options', index, 'values'],
              },
            ])
          );
        }
        return prev;
      }, new Map<string, string[]>());
    }
  });
export class CreateProductDto extends createZodDto(CreateProductSchema) {}
export const UpdateProductSchema = ProductSchemaEntity.partial();
export class UpdateProductDto extends createZodDto(UpdateProductSchema) {}
