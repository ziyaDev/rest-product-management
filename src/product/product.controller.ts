import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ZodSerializerDto } from "nestjs-zod";
import { CreateZodApiDtoSchema, PostApiResponseSchema } from "src/app.entity";
import { AuthGuard } from "src/user/user.guard";
import { ProductSchemaEntity, ProductSchemaEntityType } from "./product.entity";
import { ProductService } from "./product.service";
import { RequestWithUser } from "src/types/request";
import { CreateProductDto, UpdateProductDto } from "./product.dto";

@Controller("products")
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get()
  async getAll() {
    return;
  }
  @Post()
  @ZodSerializerDto(CreateZodApiDtoSchema(ProductSchemaEntity))
  async create(
    @Body() productDto: CreateProductDto,
    @Req() req: RequestWithUser
  ): Promise<PostApiResponseSchema<ProductSchemaEntityType>> {
    return {
      data: await this.productService.create(req.user.userId, productDto),
      message: "Product Created",
    };
  }
  @Put(":productId")
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
      message: "Product Updated",
    };
  }
}
