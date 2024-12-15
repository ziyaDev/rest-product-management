import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { z } from 'zod';
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from './user.dto';
import { UserLoginSchemaEntity, UserSchemaEntity } from './user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async register(
    registerUserDto: RegisterUserDto
  ): Promise<z.infer<typeof UserSchemaEntity>> {
    // check if user already exists
    const user = await this.userModel.findOne({
      userName: registerUserDto.userName,
    });
    if (user) {
      throw new ConflictException('UserName already exists');
    }
    try {
      const createdUser = new this.userModel(registerUserDto);
      await createdUser.save();
      return createdUser.toObject();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  async login(
    loginUserDto: LoginUserDto
  ): Promise<z.infer<typeof UserLoginSchemaEntity>> {
    const user = await this.userModel
      .findOne({ userName: loginUserDto.userName })
      .select('+password')
      .exec();

    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect');
    }
    const isPasswordCorrect = await bcrypt.compare(
      loginUserDto.password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Username or password is incorrect');
    }
    const accessToken = this.jwtService.sign({ userId: user._id });
    const { password, ...rest } = user.toObject();

    return { ...rest, access_token: accessToken };
  }
  async update(
    userName: string,
    updateUserDto: UpdateUserDto
  ): Promise<z.infer<typeof UserSchemaEntity>> {
    const user = await this.userModel.findOne({
      userName,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      // Update the user document
      Object.assign(user, updateUserDto);
      await user.save();
      const { password, ...rest } = user.toObject();
      return rest;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
