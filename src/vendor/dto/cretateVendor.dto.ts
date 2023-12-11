import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength, minLength } from "class-validator";
import { MyRole } from "../enum/business.role";

export class CreateVendor{
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
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

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    buinessName: string
    
    @IsString()
    @IsNotEmpty()
    myRoleInBusiness: MyRole
}