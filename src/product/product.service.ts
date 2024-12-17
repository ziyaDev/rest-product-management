import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';
import { z } from 'zod';
import { CreateProductSchema, UpdateProductSchema } from './product.dto';
import { ProductSchemaEntity } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>
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
      product.populate('owner');
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
    const user = await this.userModel.findOne({ _id: userId });
    // Find user and validate existence
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
      Object.assign(product, productDto);
      await product.save();
      return product.toObject();
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }
  async delete(userId: string, productId: string): Promise<null> {
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
      return null;
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }
}
