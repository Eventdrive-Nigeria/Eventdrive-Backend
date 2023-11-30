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

    @Prop({default: null})
    resetToken: string;

    @Prop({type: Boolean, default: false})
    emailConfirmed: boolean;

    @Prop({default: null})
    emailConfirmedToken: string;

    @Prop({type: Date, default: null})
    emailTokenExpiration

    @Prop({type: Date, default: null})
    resetTokenExpiration: Date;

    @Prop({type: Date, default: Date.now})
    date: Date
}

export const vendorSchema = SchemaFactory.createForClass(Vendor)