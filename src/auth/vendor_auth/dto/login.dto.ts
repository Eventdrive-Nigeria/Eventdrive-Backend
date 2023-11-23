import { IsEmail, IsString } from "class-validator";

export class LoginVendorDto{
    @IsEmail()
    email: string
  // userName?: string
   // emailOrusername: string;
    password: string;
}