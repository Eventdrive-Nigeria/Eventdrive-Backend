import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Define the type for the UserDocument, a hydrated mongoose document with User schema
export type UserDocument = HydratedDocument<User>;

// Define the mongoose schema for the User entity
@Schema({ timestamps: true })
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true })
  userName: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  phoneNumber: number;

  @Prop({ unique: true })
  password: string;

  @Prop({ default: 'active' })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
