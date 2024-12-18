import {
  Body,
  Controller,
  Param,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateZodApiDtoSchema, PostApiResponseSchema } from 'src/app.entity';
import { RequestWithUser } from 'src/types/request';
import { UpdateUserDto } from './user.dto';
import { UserSchemaEntity, UserSchemaEntityType } from './user.entity';
import { AuthGuard } from './user.guard';
import { UserService } from './user.service';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Put(':userName')
  @ZodSerializerDto(CreateZodApiDtoSchema(UserSchemaEntity))
  async updateUser(
    @Param() params: { userName: string },
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<PostApiResponseSchema<UserSchemaEntityType>> {
    if (req.user.userName !== params.userName) {
      throw new UnauthorizedException();
    }

    return {
      data: await this.userService.update(params.userName, updateUserDto),
      message: 'User has been updated',
    };
  }
}
