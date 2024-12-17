import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ZodSerializerDto } from "nestjs-zod";
import { CreateZodApiDtoSchema, PostApiResponseSchema } from "src/app.entity";
import { AuthGuard } from "src/user/user.guard";
import { ProductSchemaEntity, ProductSchemaEntityType } from "./product.entity";
import { ProductService } from "./product.service";
import { RequestWithUser } from "src/types/request";
import {
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
} from './product.dto';
import { z } from 'zod';

@Controller("products")
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get()
  async findAll(@Query() productFilter: FilterProductDto) {
    return await this.productService.findAll(productFilter);
  }
  @Post()
  @ZodSerializerDto(CreateZodApiDtoSchema(ProductSchemaEntity))
  async create(
    @Body() productDto: CreateProductDto,
    @Req() req: RequestWithUser
  ): Promise<PostApiResponseSchema<ProductSchemaEntityType>> {
    return {
      data: await this.productService.create(req.user.userId, productDto),
      message: 'Product Created',
    };
  }
  @Put(':productId')
  @ZodSerializerDto(CreateZodApiDtoSchema(ProductSchemaEntity))
  async update(
    @Query() productId: string,
    @Body() productDto: UpdateProductDto,
    @Req() req: RequestWithUser
  ): Promise<PostApiResponseSchema<ProductSchemaEntityType>> {
    return {
      data: await this.productService.update(
        req.user.userId,
        productId,
        productDto
      ),
      message: 'Product Updated',
    };
  }
  @Delete(':productId')
  @ZodSerializerDto(CreateZodApiDtoSchema(z.string()))
  async detele(
    @Param('productId') productId: string,
    @Req() req: RequestWithUser
  ): Promise<PostApiResponseSchema<string>> {
    return {
      data: await this.productService.delete(req.user.userId, productId),
      message: 'Product Deleted',
    };
  }
}
