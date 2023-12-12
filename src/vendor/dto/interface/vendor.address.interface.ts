import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class BussinessAddress{
    @IsString()
    @IsNotEmpty()
    street:string

    @IsString()
    @IsNotEmpty()
    city:  string

    @IsString()
    @IsNotEmpty()
    state: string;

    @IsNumber()
    zipcode?: number;

    @IsString()
    @IsNotEmpty()
    country: string

}