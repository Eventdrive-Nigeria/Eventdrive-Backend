import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type VendorDocument = HydratedDocument<Vendor>;

// Define the mongoose schema for the User entity
@Schema({ timestamps: true })
export class Vendor {
  @Prop({ type: mongoose.Types.ObjectId })
  id: string;

  @Prop()
  eventCenterName: string;

  @Prop()
  eventCenterAddress: string;

  @Prop()
  eventCenterDescription: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  phoneNumber: string;

  @Prop({ unique: true })
  password: string;

  @Prop()
  media: Array<string>;

  @Prop({ default: 'activated' })
  status: string;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
