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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateZodApiDtoSchema, PostApiResponseSchema } from 'src/app.entity';
import { AuthGuard } from 'src/user/user.guard';
import { ProductSchemaEntity, ProductSchemaEntityType } from './product.entity';
import { ProductService } from './product.service';
import { RequestWithUser } from 'src/types/request';
import {
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
} from './product.dto';
import { z } from 'zod';
import { WithPagination } from 'src/filter/filter.interface';
import { CreateWithPaginationSchema } from 'src/filter/filter.dto';
import { Types } from 'mongoose';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ZodSerializerDto(CreateWithPaginationSchema(z.array(ProductSchemaEntity)))
  async findAll(
    @Query() productFilter: FilterProductDto
  ): Promise<WithPagination<ProductSchemaEntityType[]>> {
    return await this.productService.findAll(productFilter);
  }

  @UseGuards(AuthGuard)
  @Get(':userId')
  @ZodSerializerDto(CreateWithPaginationSchema(z.array(ProductSchemaEntity)))
  async findAllWithOwner(
    @Query() productFilter: FilterProductDto,
    @Param('userId') userId: string,
    @Req() req: RequestWithUser
  ): Promise<WithPagination<ProductSchemaEntityType[]>> {
    if (userId !== req.user.userId) {
      throw new UnauthorizedException();
    }
    return await this.productService.findAll(productFilter, userId);
  }

  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  @Put(':productId')
  @ZodSerializerDto(CreateZodApiDtoSchema(ProductSchemaEntity))
  async update(
    @Param('productId') productId: string,
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
  @UseGuards(AuthGuard)
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
