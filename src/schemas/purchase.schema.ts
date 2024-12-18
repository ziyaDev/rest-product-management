import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from './product.schema';
import { User } from './user.schema';
export type UserDocument = HydratedDocument<Purchase>;

@Schema({ timestamps: true })
export class Purchase {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  owner: User; // owner of the purchase

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  from: User; // from who the purchase is made

  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  product: Product;

  @Prop()
  selectedOptions: { option: string; value: string }[];

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalPrice: number;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
