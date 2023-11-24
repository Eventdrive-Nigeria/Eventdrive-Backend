import { IsArray, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateVenueDto {
  @IsString()
  @IsNotEmpty()
  venueName: string;

  @IsString()
  @IsNotEmpty()
  venueAddress: string;

  @IsString()
  @IsNotEmpty()
  venueState: string;

  @IsNumberString()
  @IsNotEmpty()
  venueCapacity: number;

  @IsString()
  @IsNotEmpty()
  venueType: string;

  @IsArray()
  media: string;

  @IsString()
  @IsNotEmpty()
  venueDescription: string;

  @IsString()
  @IsNotEmpty()
  venueRating: string;
}
