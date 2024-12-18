import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { AuthGuard } from 'src/user/user.guard';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateZodApiDtoSchema, PostApiResponseSchema } from 'src/app.entity';
import { CreatePurchaseDto, FilterPurchaseDto } from './purchase.dto';
import { RequestWithUser } from 'src/types/request';
import {
  PurchaseSchemaEntity,
  PurchaseSchemaEntityType,
} from './purchase.entity';
import { z } from 'zod';
import { CreateWithPaginationSchema } from 'src/filter/filter.dto';
import { WithPagination } from 'src/filter/filter.interface';

@UseGuards(AuthGuard)
@Controller('purchases')
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}
  @Post()
  @ZodSerializerDto(CreateZodApiDtoSchema(PurchaseSchemaEntity))
  async create(
    @Body() createPurchaseDto: CreatePurchaseDto,
    @Req() req: RequestWithUser
  ): Promise<PostApiResponseSchema<PurchaseSchemaEntityType>> {
    return {
      data: await this.purchaseService.create(
        req.user.userId,
        createPurchaseDto
      ),
      message: 'Purchase has been placed',
    };
  }

  @Get()
  @ZodSerializerDto(CreateWithPaginationSchema(z.array(PurchaseSchemaEntity)))
  async findAll(
    @Query() purchaseFilter: FilterPurchaseDto,
    @Req() req: RequestWithUser
  ): Promise<WithPagination<PurchaseSchemaEntityType[]>> {
    return await this.purchaseService.findAll(purchaseFilter, req.user.userId);
  }

  @Get('stats')
  async stats(@Req() req: RequestWithUser) {
    return await this.purchaseService.stats(req.user.userId);
  }
}
