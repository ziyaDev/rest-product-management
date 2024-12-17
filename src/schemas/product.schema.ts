import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  category: string;

  @Prop({ required: true })
  quantity: number;

  //  Options for the product (e.g. Size, Color, etc.) - key is the option name, value is the option value
  // ex. { option: 'Size', value: ['XL', 'L', 'M'] }
  @Prop()
  options: { option: string; values: string[] }[];

  @Prop({ type: Types.ObjectId, ref: User.name })
  owner: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('defaultOptions').get(function () {
  return this.options.map((option) => option.values[0]);
});
