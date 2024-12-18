import { createZodDto, ZodValidationException } from 'nestjs-zod';
import {
  CreateDateFilterTypeSchema,
  CreateFilterSchema,
  CreateNumberFilterTypeSchema,
  CreateStringFilterTypeSchema,
} from 'src/filter/filter.dto';
import { z, ZodError } from 'zod';
import { PurchaseSchemaEntity } from './purchase.entity';

export const CreatePurchaseSchema = z
  .object({
    productId: z.string(),
    quantity: z.number().int().gte(1),
    selectedOptions: z
      .array(
        z.object({
          option: z.string(),
          value: z.string(),
        })
      )
      .optional(),
  })
  .superRefine((args) => {
    if (args.selectedOptions?.length) {
      args.selectedOptions.reduce((prev, curr, index) => {
        // if option name already in
        const normalizedOption = curr.option.toLowerCase();
        if (prev.has(normalizedOption)) {
          throw new ZodValidationException(
            new ZodError([
              {
                code: z.ZodIssueCode.custom,
                message: `Duplicate option found: ${normalizedOption}`,
                path: ['selectedOptions', index],
              },
            ])
          );
        }
        prev.set(normalizedOption, curr.value);
        return prev;
      }, new Map<string, string>());
    }
  });

export const FilterPurchaseSchema = z
  .object({
    totalPrice: CreateNumberFilterTypeSchema(
      PurchaseSchemaEntity.shape.totalPrice
    ),
    createdAt: CreateDateFilterTypeSchema(PurchaseSchemaEntity.shape.createdAt),
  })
  .partial();

export class FilterPurchaseDto extends createZodDto(
  CreateFilterSchema(FilterPurchaseSchema)
) {}
export class CreatePurchaseDto extends createZodDto(CreatePurchaseSchema) {}
