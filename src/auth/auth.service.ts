import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';
import { JwtPayload } from 'src/types/jwt.payload';
import { UserLoginSchemaEntity, UserSchemaEntity } from 'src/user/user.entity';
import { z } from 'zod';
import { LoginUserDto, RegisterUserDto } from './auth.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}
  async register(
    registerUserDto: z.infer<typeof RegisterUserDto>
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
    loginUserDto: z.infer<typeof LoginUserDto>
  ): Promise<z.infer<typeof UserLoginSchemaEntity>> {
    const user = await this.userModel
      .findOne({ userName: loginUserDto.userName })
      .select('+password');

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
    const payload: JwtPayload = {
      userId: user._id.toString(),
      userName: user.userName,
    };
    const accessToken = this.jwtService.sign(payload);

    return { ...user.toObject(), access_token: accessToken };
  }
}
