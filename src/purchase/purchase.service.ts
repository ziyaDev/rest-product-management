import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ZodValidationException } from 'nestjs-zod';
import { WithPagination } from 'src/filter/filter.interface';
import { ProductService } from 'src/product/product.service';
import { Purchase } from 'src/schemas/purchase.schema';
import { UserService } from 'src/user/user.service';
import { ZodError, z } from 'zod';
import { CreatePurchaseSchema, FilterPurchaseDto } from './purchase.dto';
import { PurchaseSchemaEntityType } from './purchase.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
    private productService: ProductService,
    private userService: UserService
  ) {}

  async create(
    userId: string,
    purchaseDto: z.infer<typeof CreatePurchaseSchema>
  ): Promise<PurchaseSchemaEntityType> {
    // Validate user
    const user = await this.userService.validate(userId);

    const product = await this.productService.validate(
      new Types.ObjectId(purchaseDto.productId)
    );
    if (product.quantity < purchaseDto.quantity) {
      throw new BadRequestException('Not enough quantity available');
    }
    const selectedOptions = this.validateSelectedOptions(
      product.options,
      purchaseDto.selectedOptions
    );

    const purchase = new this.purchaseModel({
      owner: user,
      product,
      from: product.owner,
      selectedOptions,
      quantity: purchaseDto.quantity,
      totalPrice: purchaseDto.quantity * product.price,
    });

    await this.trackProductPurchase(product._id, purchaseDto.quantity);
    await purchase.save();
    return purchase.toObject();
  }
  async findAll(
    filter: FilterPurchaseDto,
    userId: string
  ): Promise<WithPagination<PurchaseSchemaEntityType[]>> {
    const { limit = 10, page = 0, ...rest } = filter;
    const customefilter = { ...rest, ...(userId && { from: userId }) };

    try {
      const query = this.purchaseModel
        .find(customefilter)
        .populate(['owner', 'product'])
        .skip(page * limit)
        .limit(limit + 1);

      const queryCount = this.purchaseModel.countDocuments(customefilter);
      const [data, total] = await Promise.all([query, queryCount]);

      const hasNextPage = data.length > limit;
      const items = hasNextPage ? data.slice(0, -1) : data;

      return {
        data: items,
        pagination: {
          totalCount: total,
          totalPages: Math.ceil(total / limit),
          pageSize: limit,
          hasNextPage,
        },
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  async stats(userId: string) {
    try {
      const query = await this.purchaseModel.aggregate([
        {
          $match: {
            owner: new Types.ObjectId(userId),
          },
        },
        {
          $facet: {
            totalRevenue: [
              {
                $group: {
                  totalRevenue: {
                    $sum: { $multiply: ['$totalPrice'] },
                  },
                },
              },
            ],
            topSellingProducts: [
              {
                $group: {
                  _id: '$productId',
                  totalSold: { $sum: '$quantity' },
                },
              },
              { $sort: { totalSold: -1 } },
              { $limit: 5 },
            ],
            trends: [
              {
                $group: {
                  _id: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$createdAt',
                    },
                  },
                  totalSold: { $sum: '$quantity' },
                  revenue: {
                    $sum: { $multiply: ['$quantity', '$totalPrice'] },
                  },
                },
              },
              { $sort: { _id: 1 } },
            ],
            totalPurchases: [
              {
                $group: {
                  _id: null,
                  totalPurchases: { $sum: 1 }, // Counting each one as one purchase
                },
              },
            ],
          },
        },
      ]);
      return query;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  validateSelectedOptions(
    productOptions: {
      option: string;
      values: string[];
    }[],
    selectedOptions: {
      value?: string;
      option?: string;
    }[]
  ) {
    const options = new Map<string, string>();

    if (!selectedOptions && productOptions.length) {
      // If no selectedOptions and product has options we have to set default ones
      for (const option of productOptions) {
        options.set(option.option, option.values[0]);
      }
    } else {
      // validate options that should be all included
      for (const op of productOptions) {
        if (
          !selectedOptions.some(
            (_) => _.option.toLowerCase() === op.option.toLowerCase()
          )
        ) {
          throw new ZodValidationException(
            new ZodError([
              {
                code: z.ZodIssueCode.custom,
                path: ['selectedOptions'],
                message: `Invalid options, some ${op.option} is not included}`,
              },
            ])
          );
        }
      }

      // then we have to validate options first
      for (const option of selectedOptions) {
        if (
          // if option name does not exists
          !productOptions.some(
            (o) => o.option.toLowerCase() === option.option.toLowerCase()
          )
        ) {
          throw new ZodValidationException(
            new ZodError([
              {
                code: z.ZodIssueCode.custom,
                path: ['selectedOptions'],
                message: 'Invalid option selected',
              },
            ])
          );
          // now have to validate the option values
        }
        options.set(option.option, '');
        if (
          // if option values does not exists
          !productOptions.some((o) => {
            const lowercasedValues = new Set(
              o.values.map((value) => value.toLowerCase())
            );

            // Check if the selected option value (also lowercased) exists in the Set
            return lowercasedValues.has(option.value.toLowerCase());
          })
        ) {
          throw new ZodValidationException(
            new ZodError([
              {
                code: z.ZodIssueCode.custom,
                path: ['selectedOptionsValues'],
                message: 'Invalid option value selected',
              },
            ])
          );
        }
        options.set(option.option, option.value);
      }
    }
    return Array.from(options, ([key, value]) => ({ option: key, value }));
  }
  async trackProductPurchase(productId: Types.ObjectId, quantity: number) {
    const product = await this.productService.findOne(productId);
    if (product.quantity < quantity) {
      throw new BadRequestException('Product quantity not available');
    }
    product.quantity -= quantity;
    await product.save();
    return product;
  }
}
