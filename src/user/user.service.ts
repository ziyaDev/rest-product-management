import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { z } from 'zod';
import { UpdateUserSchemaType } from './user.dto';
import { UserSchemaEntity, UserSchemaEntityType } from './user.entity';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async update(
    userName: string,
    updateUserDto: UpdateUserSchemaType
  ): Promise<UserSchemaEntityType> {
    const user = await this.userModel.findOne({
      userName,
    });

    try {
      // Update the user document
      Object.assign(user, updateUserDto);
      await user.save();
      return user.toObject();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  async find(userName: string): Promise<z.infer<typeof UserSchemaEntity>> {
    const user = await this.userModel.findOne({ userName });
    return user.toObject();
  }
  async validate(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
