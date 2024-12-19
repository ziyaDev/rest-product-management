import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WithPagination } from 'src/filter/filter.interface';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { z } from 'zod';
import {
  CreateProductSchema,
  FilterProductDto,
  UpdateProductSchema,
} from './product.dto';
import { ProductSchemaEntity } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
    private userService: UserService
  ) {}

  async create(
    userId: string,
    productDto: z.infer<typeof CreateProductSchema>
  ): Promise<z.infer<typeof ProductSchemaEntity>> {
    const user = await this.userModel.findOne({ _id: userId });
    // Find user and validate existence
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Check that the product with same title does not exist
    const product = await this.productModel.findOne({
      title: productDto.title,
      owner: userId,
    });
    if (product) {
      throw new BadRequestException('Product with same title already exists');
    }

    try {
      // Create product
      const product = new this.productModel({
        ...productDto,
        owner: userId,
      });
      await product.save();
      await product.populate('owner');
      return product.toObject();
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }
  async update(
    userId: string,
    productId: string,
    productDto: z.infer<typeof UpdateProductSchema>
  ): Promise<z.infer<typeof ProductSchemaEntity>> {
    await this.userService.validate(userId);

    // Find the product owned by the user
    const product = await this.productModel.findOne({
      _id: productId,
      owner: userId,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    try {
      Object.assign(product, productDto);
      await product.save();
      await product.populate('owner');
      return product.toObject();
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }
  async delete(userId: string, productId: string): Promise<string> {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find the product owned by the user
    const product = await this.productModel.findOne({
      _id: productId,
      owner: userId,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    try {
      await product.deleteOne();
      return productId;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete product: ${error.message}`
      );
    }
  }
  async findOne(productId: Types.ObjectId) {
    const product = await this.productModel.findOne({ _id: productId });
    if (!product) return null;
    await product.populate('owner');
    return product;
  }
  async findAll(
    filter: FilterProductDto,
    userId?: string
  ): Promise<WithPagination<z.infer<typeof ProductSchemaEntity>[]>> {
    const { limit = 10, page = 0, ...rest } = filter;
    const customefilter = { ...rest, ...(userId && { owner: userId }) };

    try {
      const query = this.productModel
        .find(customefilter)
        .populate('owner')
        .skip(page * limit)
        .limit(limit + 1);
      const countQuery = this.productModel.countDocuments(rest);
      const [data, total] = await Promise.all([query, countQuery]);
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
  async validate(productId: Types.ObjectId) {
    const product = await this.findOne(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
