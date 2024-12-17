import { Body, Controller, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateZodApiDtoSchema, PostApiResponseSchema } from 'src/app.entity';
import { UserLoginSchemaEntity, UserSchemaEntity } from 'src/user/user.entity';
import { z } from 'zod';
import { LoginUserDto, RegisterUserDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @ZodSerializerDto(CreateZodApiDtoSchema(UserSchemaEntity))
  async registerUser(
    @Body() registerUserDto: z.infer<typeof RegisterUserDto>
  ): Promise<PostApiResponseSchema<z.infer<typeof UserSchemaEntity>>> {
    return {
      data: await this.authService.register(registerUserDto),
      message: 'Registered',
    };
  }
  @Post('login')
  @ZodSerializerDto(CreateZodApiDtoSchema(UserLoginSchemaEntity))
  async loginUser(
    @Body() loginUserDto: z.infer<typeof LoginUserDto>
  ): Promise<PostApiResponseSchema<z.infer<typeof UserLoginSchemaEntity>>> {
    return {
      data: await this.authService.login(loginUserDto),
      message: 'Login Success',
    };
  }
}
