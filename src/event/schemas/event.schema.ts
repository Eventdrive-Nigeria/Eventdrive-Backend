import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Vendor } from 'src/vendor/schemas/vendor.schema';

export type VenueDocument = HydratedDocument<Venue>;

// Define the mongoose schema for the User entity
@Schema({ timestamps: true })
export class Venue {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Vendor' })
  vendor: Vendor;

  @Prop()
  venueName: string;

  @Prop()
  venueAddress: string;

  @Prop()
  venueDescription: string;

  @Prop()
  venueType: string;

  @Prop()
  venueState: string;

  @Prop()
  venueCapacity: number;

  @Prop()
  venueRating: string;

  @Prop()
  media: Array<string>;
}
export const VenueSchema = SchemaFactory.createForClass(Venue);
