import { IsNotEmpty, IsString } from "class-validator";

export class VendorChangedPasswordDto{
  
    @IsNotEmpty()
    @IsString()
    password: string;
    
    @IsNotEmpty()
    @IsString()
    confirmedPassword: string

    @IsNotEmpty()
    @IsString()
    confirmedOldPassword: string

}