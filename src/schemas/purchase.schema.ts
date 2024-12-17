import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from './product.schema';
import { User } from './user.schema';
export type UserDocument = HydratedDocument<Purchase>;

@Schema({ timestamps: true })
export class Purchase {
  @Prop({ type: Types.ObjectId, ref: Product.name })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  owner: User;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
