import { Body, Controller, Param, Post } from '@nestjs/common';
import { RegisterUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    return await this.userService.register(registerUserDto);
  }
  @Post('login')
  async loginUser(@Body() loginUserDto: RegisterUserDto) {
    return await this.userService.login(loginUserDto);
  }
  @Post(':userName/update')
  async updateUser(
    @Param() params: { userName: string },
    @Body() updateUserDto: UpdateUserDto
  ) {
    return await this.userService.update(params.userName, updateUserDto);
  }
}
