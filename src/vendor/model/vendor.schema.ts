import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MyRole } from "../enum/business.role";

@Schema()
export class Location{
    @Prop({type: String, enum: ['Point']})
    type: string;

    @Prop({index: '2dsphere'})
    coordinates: Number[];
    formattedAddress: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
};

@Schema({timestamps: true})
export class Vendor{
    @Prop()
    fullName: string;
    @Prop()
    userName: string;
    @Prop()
    role: string;
    @Prop()
    email: string;
    @Prop()
    phoneNumber: string;
    @Prop()
    password: string;

    @Prop()
    buinessName: string;

    @Prop({enum: MyRole})
    myRoleInBusiness: MyRole;

    @Prop()
    address: string

    @Prop({type: Object, ref: 'Location'})
    location?: Location
    
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

}

export const vendorSchema = SchemaFactory.createForClass(Vendor)