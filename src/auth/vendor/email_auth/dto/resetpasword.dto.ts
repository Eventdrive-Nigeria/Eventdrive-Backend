import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDTO{

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    token: string;
  
    @IsString()
    @IsNotEmpty()
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    confirmedNewPassword: string
}