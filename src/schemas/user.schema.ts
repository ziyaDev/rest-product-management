import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  userName: string;

  @Prop({ required: true, select: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', async function (next) {
  this.userName = this.userName.toLowerCase();
  if (!this.isModified('password')) next(); // skip if no password is modified

  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// exclude password from toJSON fn
UserSchema.methods.toJSON = function () {
  const { password, ...rest } = this.toObject();
  return rest;
};
