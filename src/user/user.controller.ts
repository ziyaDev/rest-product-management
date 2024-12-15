import { Body, Controller, Param, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateZodApiDtoSchema, PostApiResponseSchema } from 'src/app.entity';
import { z } from 'zod';
import { RegisterUserDto, UpdateUserDto } from './user.dto';
import { UserLoginSchemaEntity, UserSchemaEntity } from './user.entity';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  @ZodSerializerDto(CreateZodApiDtoSchema(UserSchemaEntity))
  async registerUser(
    @Body() registerUserDto: RegisterUserDto
  ): Promise<PostApiResponseSchema<z.infer<typeof UserSchemaEntity>>> {
    return {
      data: await this.userService.register(registerUserDto),
      message: 'Registered',
    };
  }
  @Post('login')
  @ZodSerializerDto(CreateZodApiDtoSchema(UserSchemaEntity))
  async loginUser(
    @Body() loginUserDto: RegisterUserDto
  ): Promise<PostApiResponseSchema<z.infer<typeof UserLoginSchemaEntity>>> {
    return {
      data: await this.userService.login(loginUserDto),
      message: 'Login Success',
    };
  }
  @Post(':userName/update')
  @ZodSerializerDto(CreateZodApiDtoSchema(UserSchemaEntity))
  async updateUser(
    @Param() params: { userName: string },
    @Body() updateUserDto: UpdateUserDto
  ): Promise<PostApiResponseSchema<z.infer<typeof UserSchemaEntity>>> {
    return {
      message: 'Update Success',
      data: await this.userService.update(params.userName, updateUserDto),
    };
  }
}
