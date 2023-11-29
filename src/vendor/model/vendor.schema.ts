import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type VendorDocument = HydratedDocument<Vendor>
@Schema()
export class Vendor{
    @Prop()
    firstName: string;
    @Prop()
    lastName: string;
    @Prop()
    userName: string;
    @Prop()
    email: string;
    @Prop()
    password: string;
    @Prop({default: 'activated'})
    status: string

    @Prop({default: true})
    resetToken: string;

    @Prop({type: Date, default: true})
    resetTokenExpiration: Date;

    @Prop({type: Date, default: Date.now})
    date: Date
}

export const vendorSchema = SchemaFactory.createForClass(Vendor)