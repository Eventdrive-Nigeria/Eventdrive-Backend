import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class confirmedVendorEmailDTO{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    confirmedToken: string;
}