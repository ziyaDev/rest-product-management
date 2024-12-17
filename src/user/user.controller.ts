import {
  Controller,
  Param,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { RequestWithUser } from 'src/types/request';
import { z } from 'zod';
import { UserSchemaEntity } from './user.entity';
import { AuthGuard } from './user.guard';
import { UserService } from './user.service';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Put(':userName')
  @ZodSerializerDto(UserSchemaEntity)
  async updateUser(
    @Param() params: { userName: string },
    @Req() req: RequestWithUser
  ): Promise<z.infer<typeof UserSchemaEntity>> {
    if (req.user.userName !== params.userName) {
      throw new UnauthorizedException();
    }
    return await this.userService.find(params.userName);
  }
}
