import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

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
  media: 'picture' | 'video';
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsEnum(['activated', 'suspended'], {
    message: 'vendor can be either activated or suspended',
  })
  status: string;
}
