import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgetEmailDto{
    @IsEmail()
    @IsNotEmpty()
    email: string
}