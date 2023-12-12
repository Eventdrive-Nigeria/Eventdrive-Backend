import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";
import { MyRole } from "../enum/business.role";
import { BussinessAddress } from "./vendor.address.dto";

export class CreateVendor {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    @MinLength(11)
    @MaxLength(20)
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    bussinessAddress: BussinessAddress; // Fixed the property name

    @IsString()
    @IsNotEmpty()
    buinessName: string; // Fixed the property name

    @IsString()
    @IsNotEmpty()
    myRoleInBusiness: MyRole;
}
