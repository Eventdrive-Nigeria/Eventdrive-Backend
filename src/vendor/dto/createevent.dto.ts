import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  eventCenterName: string;
  @IsString()
  @IsNotEmpty()
  eventCenterAddress: string;
  @IsString()
  @IsNotEmpty()
  eventCenterDescription: string;
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsArray()
  media: string;
  @IsString()
  @IsNotEmpty()
  password: string;

  status?: string;
}
