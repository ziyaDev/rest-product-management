import { Controller } from '@nestjs/common';
import { PurchaseService } from './purchase.service';

@Controller('purchases')
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}
  // @UseGuards(AuthGuard)
  // @Post()
  // @ZodSerializerDto(CreateZodApiDtoSchema(ProductSchemaEntity))
  // async create() {
  //   return await this.purchaseService.create();
  // }
}
